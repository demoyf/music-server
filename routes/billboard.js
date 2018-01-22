var express = require('express');
var router = express.Router();
const QUERY_UTIL = require('./../lib/net/get_data');
const REDIS = require("./../lib/redis/redis_util");
let http_redis = require('./../lib/redis/http_redis');
let _key_type = require('./../lib/redis/key_type');
router.get("/", function(req, res, next) {
    let type = req.query.type || 1;
    let offset = req.query.offset || 0;
    let limit = req.query.size || 20;
    res.type("text/javascript");
    let myBillBoard = {};
    let key_and_type = _key_type["type"+type];
    REDIS.getStringByKey(key_and_type.name).then(function(name_data) {
        myBillBoard.billboard = JSON.parse(name_data);
        REDIS.getBillBoardFromRedis(key_and_type.key, (offset / 20)).then((redis_data) => {
            if (redis_data) {
                console.log("i'm in redis");
                if (typeof redis_data == "string") {
                    myBillBoard.song_list = JSON.parse(redis_data);
                } else {
                    myBillBoard.song_list = redis_data;
                }
                res.end(JSON.stringify(myBillBoard));
                return;
            } else {
                _query_data(type);
            }
        }).catch(() => {
            _query_data(type);
        });
    });

    function _query_data() {
        console.log("i'm in network");
        QUERY_UTIL.NET_getBillBoardByType(type, offset, limit).then((data) => {
            res.end(data);
            http_redis.request_billboard_data_save();
            return;
        }).catch((error) => {
            res.end(error);
        });
    }
});

module.exports = router;