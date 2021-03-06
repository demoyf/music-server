const REDIS = require('redis');
const CLIENT = REDIS.createClient(6379, '127.0.0.1', {});
CLIENT.on("error", (err) => {
    console.log("error");
});
let slove = {
    // key page obj expire
    saveBillBoardToRedis(key, obj, expire = 30000000) {
        CLIENT.rpush(key, obj);
        CLIENT.expire(key, expire);
    },
    getBillBoardFromRedis(key, page = 0) {
        return new Promise((resolve, reject) => {
            CLIENT.lindex(key, page, function(err, result) {
                if (err) {
                    reject();
                } else {
                    resolve(result);
                }
            });
        });
    },
    saveStringByKey(key, result, expire = 30000000) {
        CLIENT.set(key, result);
        CLIENT.expire(key, expire);
    },
    getStringByKey(key) {
        return new Promise((resolve, reject) => {
            CLIENT.get(key, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    get_form_list(key, page = 0) {
        return new Promise((resolve, reject) => {
            CLIENT.lindex(key, page, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    // key page obj expire
    save_into_list(key, obj, expire = 30000000) {
        CLIENT.rpush(key, obj);
        CLIENT.expire(key, expire)
    },
    remove(key) {
        CLIENT.del(key);
    }
}
if (!global.redis_redis_util) {
    global.redis_redis_util = slove;
}
module.exports = slove;
