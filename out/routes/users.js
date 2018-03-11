"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var User_1 = require("../model/User");
var Meta_1 = require("../model/Meta");
var uuid = require('node-uuid');
var MongoUtil = require('../MongoUtil');
var users = express_1.Router();
// 新規ユーザー登録
users.post('/', function (req, res, next) {
    MongoUtil.connect(function (err, db) {
        if (err) {
            console.error("DB connect error: " + err);
            res.sendStatus(500);
            return;
        }
        var countersTable = db.collection('counters');
        var usersTable = db.collection('users');
        countersTable.findAndModify({ name: "user_id" }, [], { $inc: { seq: 1 } }, { new: true }, function (err, ret) {
            var newUser = new User_1.User(process.env.USER_ID_PREFIX + ret.value.seq, "No name");
            newUser.token = uuid.v4();
            usersTable.insert(newUser);
            res.send({ meta: new Meta_1.Meta(201), data: JSON.stringify(newUser) });
        });
    });
});
/*
var user = new User("make-new-id", "No name");
user.token = uuid.v4();
res.send({"meta": new Meta(201), "data": {"user": user}});
*/
// ログイン（登録済みユーザーからリソースサーバへアクセスすためのセッションを取得）
users.get('/', function (req, res, next) {
    var id = req.params.id;
    var token = req.params.token;
    if (!id || !token) {
        res.sendStatus(400);
        return;
    }
    res.send({ "meta": new Meta_1.Meta(200) });
});
// ユーザー情報（公開情報）を取得
users.get('/:id', function (req, res, next) {
    res.send({ "meta": new Meta_1.Meta(200), "data": { "user": new User_1.User("hoge", "hige") } });
});
exports.default = users;
//# sourceMappingURL=users.js.map