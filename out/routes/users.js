"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var User_1 = require("../model/User");
var Meta_1 = require("../model/Meta");
var uuid = require('node-uuid');
var MongoUtil = require('../MongoUtil');
var redis = require('redis');
var redisClient = redis.createClient();
var users = express_1.Router();
// 新規ユーザー登録
users.post('/', function (req, res, next) {
    MongoUtil.connect(function (err, db) {
        if (err) {
            res.status(500).send({ meta: new Meta_1.Meta(500, "DB connect err") });
            return;
        }
        var countersTable = db.collection('counters');
        var usersTable = db.collection('users');
        countersTable.findAndModify({ name: "user_id" }, [], { $inc: { seq: 1 } }, { new: true }, function (err, ret) {
            var newUser = new User_1.User(process.env.USER_ID_PREFIX + ret.value.seq, "No name");
            newUser.secret = {
                token: uuid.v4()
            };
            usersTable.insert(newUser);
            res.status(201).send({
                meta: new Meta_1.Meta(201),
                data: {
                    user: newUser
                }
            });
        });
    });
});
// ログイン（登録済みユーザーからリソースサーバへアクセスすためのセッションを取得）
users.post('/login', function (req, res, next) {
    var id = req.body.id;
    var token = req.body.token;
    if (!id || !token) {
        res.status(400).send({ meta: new Meta_1.Meta(400, "Bad request") });
        return;
    }
    MongoUtil.connect(function (err, db) {
        if (err) {
            res.status(500).send({ meta: new Meta_1.Meta(500, "DB connect err") });
            return;
        }
        var usersTable = db.collection('users');
        usersTable.findOne({ id: id, secret: { token: token } }, function (err, result) {
            if (err) {
                res.status(500).send({ meta: new Meta_1.Meta(500, "DB request err") });
                return;
            }
            if (!result) {
                res.status(404).send({ meta: new Meta_1.Meta(404, "Not found") });
                return;
            }
            // 古いセッションがあれば削除
            clearSession(result.id, function (err) {
                if (err) {
                    res.status(500).send({ meta: new Meta_1.Meta(500, "redis error") });
                    return;
                }
                // 新たなセッションを作成
                var session = result.id + ":" + uuid.v4();
                redisClient.set(session, JSON.stringify(result), function () {
                    res.send({ meta: new Meta_1.Meta(200), data: { session: session } });
                });
            });
        });
    });
});
function clearSession(id, done) {
    redisClient.keys(id + ":*", function (err, keys) {
        if (err) {
            done(err);
            return;
        }
        keys.forEach(function (key) {
            console.log("remove old session: " + key);
            redisClient.del(key, function (err, response) {
                if (err) {
                    done(err);
                    return;
                }
            });
        });
        done();
    });
}
// ユーザー情報（公開情報）を取得
users.get('/:id', function (req, res, next) {
    MongoUtil.connect(function (err, db) {
        if (err) {
            res.status(500).send({ meta: new Meta_1.Meta(500, "DB connect err") });
            return;
        }
        var usersTable = db.collection('users');
        usersTable.findOne({ id: req.params.id }, function (err, result) {
            if (err) {
                res.status(500).send({ meta: new Meta_1.Meta(500, "DB request err") });
                return;
            }
            if (!result) {
                res.status(404).send({ meta: new Meta_1.Meta(404, "Not found") });
                return;
            }
            result.secret = undefined;
            res.send({ meta: new Meta_1.Meta(200), data: { user: result } });
        });
    });
});
exports.default = users;
//# sourceMappingURL=users.js.map