const REDIS = require('redis');
const CLIENT = REDIS.createClient(6379, '127.0.0.1', {});
CLIENT.on("error", (err) => {
    console.log("error");
});
let slove = {
    // key page obj expire
    saveBillBoardToRedis(key, page = 1, obj, expire = 3000) {
        page = parseInt(page);
        let index = page - 1 < 0 ? 0 : page - 1;
        CLIENT.rpush(key, obj);
        CLIENT.expire(key, expire);
    },
    getBillBoardFromRedis(key, page) {
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
    },
    get_form_list(key, page) {
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
    save_into_list(key, page = 1, obj, expire = 3000) {
        page = parseInt(page);
        let index = (page - 1 < 0) ? 0 : page - 1;
        CLIENT.rpush(key, index, obj);
        CLIENT.expire(key, expire)
    },
    remove(key) {
        CLIENT.del(key);
    }
}

module.exports = slove;