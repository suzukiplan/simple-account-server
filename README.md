# simple-account-server

Node.js + TypeScript + Express + MongoDB + Redis で作成したシンプルなアカウントサーバです。
これは, スマートフォンのソーシャルゲームでの利用を想定して試作してみたものです。
実際にコレで実用に耐えうるかは未知数ですが, なるべく実用に耐えうる可用性と性能にします。

## License
MIT

## How to use
以下, Mac上で動作させる手順を示します。（Linuxでもミドルのインストール手順を適宜適当に読み替えれば動く筈）

### 1. Install & Start mongoDB
アカウントの永続情報は MongoDB (NoSQL方式 の高速な DBMS) で保持します。
```
brew install mongodb
mongod --dbfile=/path/to/db
```

### 2. Install & Start redis
アカウントの一時的なセッション情報を Redis (オンメモリDB) で保持します。
```
brew install redis
redis-server
```

> (参考) アカウント公開情報の参照処理を, redis ⇒ mongoDB の順に読み込むようにすることで, ヒット時の応答時間をかなり短くすることができます。実際にキャッシュされたユーザ (u3) と キャッシュされていないユーザ (u4) の参照応答時間の実測値を以下に示します。
> ```
> GET /users/u4 200 21.638 ms - 101
> GET /users/u3 200 2.357 ms - 116
> GET /users/u4 200 5.643 ms - 101
> GET /users/u3 200 1.831 ms - 116
> GET /users/u4 200 10.334 ms - 101
> GET /users/u3 200 1.066 ms - 116
> ```

### 3. Install & Start simple-account-server
```
git clone https://github.com/suzukiplan/simple-account-server
cd simple-account-server
npm install
npm start
```

## Settings

[`.env`ファイル](.env)で各種設定ができます

|name|descriptin|
|:---|:---|
|`MONGO_DB_URI`|接続先mongoDBのURIを設定|
|`REDIS_URI`|接続先RedisのURIを設定|
|`USER_ID_PREFIX`|ユーザ名のプレフィックスを設定|

## Specifications

### `[POST] /users` - ユーザ情報の登録
##### (request)
```
curl -X POST http://localhost:3000/users
```

##### (response)
```
{
    "meta": {
        "status": 201
    },
    "data": {
        "user": {
            "id": "user-id",
            "name": "user-name",
            "secret": {
                "token": "token-string"
            }
        }
    }
}
```

### `[POST] /users/login` - セッション取得（ログイン）
##### (request)
```
curl -X POST -H 'Content-Type:application/json' -d '{"id": "user-id", "token": "token-string"}' http://localhost:3000/users/login
```

##### (response)
```
{
    "meta": {
        "status": 200
    },
    "data": {
        "session": "session-string"
    }
}
```

### `[PUT] /users` - 自分のユーザ情報の更新
##### (request)
```
curl -X PUT -H 'Content-Type:application/json' -d '{"session":"session-string", "name": "New user name"}' http://localhost:3000/users
```

##### (response)
```
{
    "meta": {
        "status": 200,
        "message": "Updated"
    }
}
```

### `[GET] /users/{id}` - ユーザ公開情報を取得
##### (request)
```
curl -X GET http://localhost:3000/users/:user-id
```

##### (response)
```
{
    "meta": {
        "status": 200
    },
    "data": {
        "user": {
            "id": "user-id",
            "name": "user-name"
        }
    }
}
```
