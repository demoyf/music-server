var express = require('express');
var router = express.Router();
const QUERY_UTIL = require('./../lib/net/get_data');
const SLOVE_DATA = require('./../lib/slove/slove_data');
const REDIS = require("./../lib/redis/redis_util");
let http_redis = require('./../lib/redis/http_redis');
router.get("/", function(req, res, next) {
    let type = req.query.type || 1;
    let offset = req.query.offset || 0;
    let limit = req.query.size || 20;
    res.type("text/javascript");
    http_redis.request_billboard_data_save();
    REDIS.getBillBoardFromRedis(("type_" + type), (offset / 20)).then((redis_data) => {
        if (redis_data) {
        	console.log("i'm in redis");
        	let final = JSON.parse(redis_data);
            res.end(final);
        } else {
        	_query_data();
        }
    }).catch(() => {
    	_query_data();
    });
    function _query_data() {
    	console.log("i'm in network");
        QUERY_UTIL.NET_getBillBoardByType(type, offset, limit).then((data) => {
            res.end(data);
            REDIS.saveBillBoardToRedis(("type_"+type),JSON.stringify(data));
        }).catch((error) => {
            res.end("error");
        });
    }
});

module.exports = router;