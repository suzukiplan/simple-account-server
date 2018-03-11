"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var User_1 = require("./model/User");
var Meta_1 = require("./model/Meta");
var node_uuid_1 = require("node-uuid");
var users = express_1.Router();
// 新規ユーザー登録
users.post('/', function (req, res, next) {
    var user = new User_1.User("make-new-id", "No name");
    user.token = node_uuid_1.uuid.v4();
    res.send({ "meta": new Meta_1.Meta(201), "data": { "user": user } });
});
// 登録済みユーザーのセッションを取得
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