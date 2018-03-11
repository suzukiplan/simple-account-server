import { Router } from 'express'
import { User } from './model/User'
import { Meta } from './model/Meta'
import { uuid } from 'node-uuid'

const users:Router = Router();

// 新規ユーザー登録
users.post('/', function(req, res, next) {
  var user = new User("make-new-id", "No name");
  user.token = uuid.v4();
  res.send({"meta": new Meta(201), "data": {"user": user}});
});

// 登録済みユーザーからリソースサーバへアクセスすためのセッションを取得
users.get('/', function(req, res, next) {
  var id: string = req.params.id;
  var token: string = req.params.token;
  if (!id || !token) {
    res.sendStatus(400);
    return;
  }
  res.send({"meta": new Meta(200)});
});

// ユーザー情報（公開情報）を取得
users.get('/:id', function(req, res, next) {
  res.send({"meta": new Meta(200), "data": {"user": new User("hoge", "hige")}});
});

export default users;
