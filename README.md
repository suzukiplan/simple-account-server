# simple-account-server

Node.js + TypeScript + Express + MongoDB + redis で作成したシンプルなアカウントサーバです。
これは, スマートフォンのソーシャルゲームでの利用を想定して試作してみたものです。

## How to use

### 1. Install mongoDB
```
brew install mongodb
```

### 2. Start mongoDB
```
mongod --dbfile=/path/to/db
```

### 3. Install simple-account-server
```
git clone https://github.com/suzukiplan/simple-account-server
cd simple-account-server
npm install
```

### 4. Start
```
npm start
```

## Settings

[`.env`ファイル](.env)で各種設定ができます

|name|descriptin|
|:---:|:---|
|MONGO_DB_URI|接続先mongoDBのURIを設定|
|USER_ID_PREFIX|ユーザ名のプレフィックスを設定|

