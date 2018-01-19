const REDIS = require('redis');
const CLIENT = REDIS.createClient(6379, '127.0.0.1', {});
const KEY_TYPE = require("./key_type");
CLIENT.on("error", (err) => {
    console.log("error");
});
let slove = {
    saveBillBoardToRedis(key, obj) {
        let res = KEY_TYPE[key];
        console.log(res.key);
        CLIENT.rpush(res.key, obj);
        CLIENT.expire(res.key, 60);
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
        })
    }
}

module.exports = slove;