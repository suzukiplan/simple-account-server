# Simple AP Server (code base)

これは, Node.js + TypeScript + Express + MongoDB + Redis で作成したシンプルなAPサーバのコードベースです。
スマートフォンのソーシャルゲーム（サーバサイド）での利用を想定して試作してみたものです。
ただし, 実際に実用に耐えうるかは未知数です。

## License
MIT

## How to use
以下, Mac上で動作させる手順を示します。（Linuxでもミドルのインストール手順を適宜適当に読み替えれば動作できます）

### 1. Install & start MongoDB
永続情報は MongoDB (NoSQL方式 の高速な DBMS) で保持します。
```
brew install mongodb
mongod --dbfile=/path/to/db
```

### 2. Install & start Redis
データベースからのI/Oは低速なため, 読み込んだ内容を Redis (オンメモリDB) で保持することで, データの読み込み速度を高速化します。
```
brew install redis
redis-server
```

### 3. Install & start Simple AP Server
```
git clone https://github.com/suzukiplan/simple-ap-server
cd simple-ap-server
npm install
npm start
```

## Settings

[`.env`ファイル](.env)で各種設定ができます

|name|descriptin|
|:---|:---|
|`MONGO_DB_URI`|接続先mongoDBのURIを設定|
|`REDIS_URI`|接続先RedisのURIを設定|
|`USER_ID_PREFIX`|ユーザIDのプレフィックスを設定|
|`DEFAULT_USER_NAME`|ユーザ登録時点のデフォルト名を設定|

## USERS API

ユーザアカウント関連の機能のAPIを提供しています。

### `[POST] /users` - ユーザ情報の登録（新規作成）

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
            "id": "ユーザID",
            "name": "ユーザ名",
            "secret": {
                "token": "パストークン"
            }
        }
    }
}
```

|Field|Description|
|---|---|
|`data.user.id`|ユーザを一意に識別するためのIDです|
|`data.user.name`|ユーザの表示名です|


### `[POST] /users/login` - セッション取得（ログイン）
##### (request)
```
curl -X POST -H 'Content-Type:application/json' -d '{"id": "ユーザID", "token": "パストークン"}' http://localhost:3000/users/login
```

##### (response)
```
{
    "meta": {
        "status": 200
    },
    "data": {
        "session": "セッション文字列"
    }
}
```

### `[PUT] /users` - 自分のユーザ情報の更新
##### (request)
```
curl -X PUT -H 'Content-Type:application/json' -H 'Cookie:session=セッション文字列' -d '{"name": "New user name"}' http://localhost:3000/users
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
