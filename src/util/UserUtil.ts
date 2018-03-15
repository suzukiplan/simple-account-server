import { User } from '../model/User'
import { redisClient } from '../util/RedisUtil';
const MongoUtil = require('../util/MongoUtil');

function update(user: User, session: string, done: (err?: Error) => void) {
    // DBを更新
    MongoUtil.connect((err, db) => {
        if (err) {
            done(err);
            return;
        }
        var usersTable = db.collection('users');
        // TODO: 更新に対応したパラメタを増やした場合 $set に追加する
        usersTable.updateOne(
            { id: user.id, secret: { token: user.secret.token } },
            { $set: { "name": user.name } },
            (err, result) => {
                if (err) {
                    done(err);
                } else {
                    // redisを更新
                    redisClient.set(session, JSON.stringify(user), (err) => {
                        if (err) {
                            done(err);
                            return;
                        }
                        done();
                    });
                }
            }
        );
    });
}

export { update }
