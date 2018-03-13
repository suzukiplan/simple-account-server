import { Router } from 'express'
import { User } from '../model/User'
import { Meta } from '../model/Meta'

const uuid = require('node-uuid');
const MongoUtil = require('../MongoUtil');
const redis = require('redis');
const redisClient = redis.createClient();
const users: Router = Router();

// 新規ユーザー登録
users.post('/', function (req, res, next) {
    MongoUtil.connect((err, db) => {
        if (err) {
            res.status(500).send({ meta: new Meta(500, "DB connect err") });
            return;
        }
        var countersTable = db.collection('counters');
        var usersTable = db.collection('users');
        countersTable.findAndModify({ name: "user_id" }, [], { $inc: { seq: 1 } }, { new: true }, (err, ret) => {
            var newUser = new User(process.env.USER_ID_PREFIX + ret.value.seq, "No name");
            newUser.secret = {
                token: uuid.v4()
            };
            usersTable.insert(newUser);
            res.status(201).send({
                meta: new Meta(201),
                data: {
                    user: newUser
                }
            });
        });
    });
});

// ログイン（登録済みユーザーからリソースサーバへアクセスすためのセッションを取得）
users.post('/login', function (req, res, next) {
    var id: string = req.body.id;
    var token: string = req.body.token;
    if (!id || !token) {
        res.status(400).send({ meta: new Meta(400, "Bad request") });
        return;
    }
    MongoUtil.connect((err, db) => {
        if (err) {
            res.status(500).send({ meta: new Meta(500, "DB connect err") });
            return;
        }
        var usersTable = db.collection('users');
        usersTable.findOne({ id: id, secret: { token: token } }, (err, result) => {
            if (err) {
                res.status(500).send({ meta: new Meta(500, "DB request err") });
                return;
            }
            if (!result) {
                res.status(404).send({ meta: new Meta(404, "Not found") });
                return;
            }
            // 古いセッションがあれば内容をcommitしてから削除
            commit(result.id, (err) => {
                if (err) {
                    res.status(500).send({ meta: new Meta(500, "redis error") });
                    return;
                }
                // 新たなセッションを作成
                var session = result.id + ":" + uuid.v4();
                redisClient.set(session, JSON.stringify(result), () => {
                    res.send({ meta: new Meta(200), data: { session: session } });
                });
            });
        });
    });
});

function commit(id: string, done: (err?: Error) => void) {
    redisClient.keys(id + ":*", (err, keys: string[]) => {
        if (err) {
            done(err);
            return;
        }
        keys.forEach(key => {
            // TODO: commit to mongoDB
            redisClient.del(key, (err, response) => {
                if (err) {
                    done(err);
                    return;
                }
            });
        });
        done();
    })
}

// ユーザー情報（公開情報）を取得
// キャッシュ (redis) が存在する場合はキャッシュから読み, 無ければmongoDBから読む
users.get('/:id', function (req, res, next) {
    var id = req.params.id;
    redisClient.keys(id + ":*", (err, keys: string[]) => {
        if (err || keys.length < 1) {
            readUserFromDB(id, res);
            return;
        }
        redisClient.get(keys[0], (err, result) => {
            if (err || !result) {
                readUserFromDB(id, res);
            } else {
                var user = JSON.parse(result);
                user.secret = undefined;
                res.send({ meta: new Meta(200), data: { user: user }, isCache: true });
            }
        });
    })
});

function readUserFromDB(id: string, res) {
    MongoUtil.connect((err, db) => {
        if (err) {
            res.status(500).send({ meta: new Meta(500, "DB connect err") });
            return;
        }
        var usersTable = db.collection('users');
        usersTable.findOne({ id: id }, (err, result) => {
            if (err) {
                res.status(500).send({ meta: new Meta(500, "DB request err") });
                return;
            }
            if (!result) {
                res.status(404).send({ meta: new Meta(404, "Not found") });
                return;
            }
            result.secret = undefined;
            res.send({ meta: new Meta(200), data: { user: result } });
        });
    });
}

export default users;
