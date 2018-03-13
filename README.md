# simple-account-server

Node.js + TypeScript + Express + MongoDB + Redis で作成したシンプルなアカウントサーバです。
これは, スマートフォンのソーシャルゲームでの利用を想定して試作してみたものです。
実際にコレで実用に耐えうるかは未知数ですが, なるべく実用に耐えうる可用性と性能にします。

## How to use

### 1. Install & Start mongoDB
アカウントの永続情報は MongoDB (NoSQL方式 の高速な DBMS) で保持します。
```
brew install mongodb
mongod --dbfile=/path/to/db
```

### 2. Install & Start redis
アカウントの一時的なセッション情報を Redis (オンメモリDB) で保持します。
アカウント公開情報の参照時は, redis ⇒ mongoDB の順に読み込むことで, ヒット時のレスポンス速度を 1/2 程度に下げることができます。（その代わり, ヒットしなかった時の性能は mongoDB のみの場合と比較して 1.5倍 程度になります）
```
brew install redis
redis-server
```

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
|:---:|:---|
|MONGO_DB_URI|接続先mongoDBのURIを設定|
|USER_ID_PREFIX|ユーザ名のプレフィックスを設定|

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
__TODO (not implemented)__

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
