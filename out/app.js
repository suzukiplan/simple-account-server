"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var path = require("path");
var index_1 = require("./routes/index");
var users_1 = require("./routes/users");
var cookieParser = require("cookie-parser"); // this module doesn't use the ES6 default export yet
// .envから環境設定を読み込む
require('dotenv').config();
var app = express();
// DB初期化
function initDB(done) {
    var MongoUtil = require('./MongoUtil');
    MongoUtil.connect(function (err, db) {
        if (err)
            throw err;
        var counters = db.collection('counters');
        counters.findOne({ name: "user_id" }, function (err, result) {
            if (err) {
                throw err;
            }
            else {
                if (!result) {
                    console.log("counters.user_id initialized");
                    counters.insert({ name: "user_id", seq: 0 });
                }
                else {
                    console.log("latest user_id: " + result.seq);
                }
            }
            done();
        });
    });
}
// サーバ初期化
function initServer() {
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    // uncomment after placing your favicon in /public
    //app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/', index_1.default);
    app.use('/users', users_1.default);
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });
    // error handlers
    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (error, req, res, next) {
            res.status(error['status'] || 500);
            res.render('error', {
                message: error.message,
                error: error
            });
        });
    }
    // production error handler
    // no stacktraces leaked to user
    app.use(function (error, req, res, next) {
        res.status(error['status'] || 500);
        res.render('error', {
            message: error.message,
            error: {}
        });
        return null;
    });
}
initDB(function () {
    initServer();
});
exports.default = app;
//# sourceMappingURL=app.js.map