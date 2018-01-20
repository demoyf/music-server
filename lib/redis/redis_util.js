const REDIS = require('redis');
const CLIENT = REDIS.createClient(6379, '127.0.0.1', {});
const KEY_TYPE = require("./key_type");
CLIENT.on("error", (err) => {
    console.log("error");
});
let slove = {
    saveBillBoardToRedis(key, obj, expire = 3000) {
        let res = KEY_TYPE[key];
        CLIENT.rpush(res.key, obj);
        CLIENT.expire(res.key, expire);
    },
    getBillBoardFromRedis(key, index) {
        let res = KEY_TYPE[key];
        return new Promise((resolve, reject) => {
            CLIENT.lindex(res.key, index, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    saveStringByKey(key, result, expire = 3000) {
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
    }
}

module.exports = slove;