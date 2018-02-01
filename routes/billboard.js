var express = require('express');
var router = express.Router();
const QUERY_UTIL = require('./../lib/net/get_data');
const REDIS = require("./../lib/redis/redis_util");
let http_redis = require('./../lib/redis/http_redis');
let _key_type = require('./../lib/redis/key_type');
// let _redis_param = require('./../lib/redis/')
router.get("/:type/:page", function(req, res, next) {
    let page = req.params.page;
    let type = req.params.type;
    let limit = 20;
    let offset = (page - 1) * limit || 0;
    res.type("text/json");
    let myBillBoard = {};
    let key_and_type = _key_type["type_" + type];
    REDIS.getStringByKey(key_and_type.name).then(function(name_data) {
        if (name_data) {
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
        } else {
            _query_data(type);
        }
    });

    function _query_data(type) {
        console.log("i'm in network");
        QUERY_UTIL.NET_getBillBoardByType(type, offset, limit).then((data) => {
            let temp = JSON.parse(data);
            let billboard = temp.billboard;
            let song_sum = billboard.billboard_songnum > 100 ? 100 : billboard.billboard_songnum;
            let temp_billboard = {
                name: billboard.name,
                page_num: song_sum % 20 == 0 ? song_sum / 20 : Math.floor(song_sum / 20) + 1,
                time: billboard.update_date
            }
            temp.billboard = temp_billboard;
            res.end(JSON.stringify(temp));
            http_redis.request_billboard_data_save(type);
            return;
        }).catch((error) => {
            res.end(error);
        });
    }
});

module.exports = router;