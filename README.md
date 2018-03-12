# simple-account-server

Node.js + TypeScript + Express + MongoDB で作成したシンプルなアカウントサーバです。
これは, スマートフォンのソーシャルゲームでの利用を想定して試作してみたものです。

## How to use

### 1. Install & Start mongoDB
アカウントの永続情報は MongoDB (NoSQL方式 の高速な DBMS) で保持します。
```
brew install mongodb
mongod --dbfile=/path/to/db
```

### 2. Install & Start redis
MongoDB が高速とはいっても, アカウントに紐づくデータ（プレイの実績やニックネーム等）はかなりの頻度で更新されるので, 十分なパフォーマンスが得られないと想定されます。そこで, Redis (オンメモリでデータを管理できるKVS) を用います。
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

## Tests

### Register new user
#### (request)
```
curl -X POST http://localhost:3000/users
```

#### (response)
```
{
  "meta": {
    "status": 201
  },
  "data": {
    "user": {
      "newUser": {
        "id": "user-id",
        "name": "user-name",
        "secret": {
          "token": "token-string"
        }
      }
    }
  }
}
```

### Login (get session)
#### (request)
```
curl -X GET -H 'Content-Type:application/json' -d '{"id": "user-id", "token": "token-string"}' http://localhost:3000/users
```

#### (response)
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

### Update user data
TODO (not implemented)

### Get other user data
#### (request)
```
curl -X GET http://localhost:3000/users/:user-id
```

#### (response)
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