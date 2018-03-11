import { MongoClient } from 'mongodb'

function connect(callback: (err, db?) => void) {
    MongoClient.connect(process.env.MONGO_DB_URI, (err, database) => {
        if (err) {
            callback(err)
        } else {
            callback(undefined, database.db('acount'));
        }
    });
}

export {
    connect
}