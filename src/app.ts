import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import users from './routes/users';
import cookieParser = require('cookie-parser'); // this module doesn't use the ES6 default export yet

const app: express.Express = express();

// DB初期化
function initDB(done: () => void) {
    const MongoUtil = require('./MongoUtil');
    MongoUtil.connect((err, db) => {
        if (err) throw err;
        var counters = db.collection('counters');
        counters.findOne({ name: "user_id" }, (err, result) => {
            if (err) {
                throw err;
            } else {
                if (!result) {
                    console.log("counters.user_id initialized");
                    counters.insert({ name: "user_id", seq: 0 });
                } else {
                    console.log("latest user_id: " + result.seq);
                }
            }
            done();
        })
    });
}

// サーバ初期化
function initServer() {
    // view engine setup
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    // TODO: 以下の要領でルートを追加
    app.use('/users', users);

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
        var err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });

    // production error handler
    // no stacktraces leaked to user
    app.use((error: any, req, res, next) => {
        res.sendStatus(error['status'] || 500);
        return null;
    });
}

initDB(() => {
    initServer();
})

export default app;