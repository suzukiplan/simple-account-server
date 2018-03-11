"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
function connect(callback) {
    mongodb_1.MongoClient.connect(process.env.MONGO_DB_URI, function (err, database) {
        if (err) {
            callback(err);
        }
        else {
            callback(undefined, database.db('acount'));
        }
    });
}
exports.connect = connect;
//# sourceMappingURL=MongoUtil.js.map