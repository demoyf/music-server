var express = require('express');
var router = express.Router();
const QUERY_UTIL = require('./../lib/net/get_data');
// const SLOVE_DATA = require('./../lib/slove/slove_data');
/* GET home page. */
const _query_db = require('./../lib/db/query_db');
const _redis = require('./../lib/redis/redis_util');
let http_redis = require('./../lib/redis/http_redis');
let _page_and_param = require('./../lib/redis/page_and_param');
router.get('/', function(req, res, next) {
    let id = req.query.tinguid;
    if (!id) {
        id = 1052;
    }
    let result = _query_db.DB_getAritstByTingUID(id);
    res.type("text/javascript");
    result.then(function(data) {
        if (data) {
            console.log("read in db");
            res.json(data);
        } else {
            let temp = QUERY_UTIL.NET_getAritstByTingUID(id);
            temp.then(function(data) {
                res.setHeader('charset', "utf-8");
                res.end(data);
                _query_db.sloveArtistAndInsert(data);
            });
        }
    });
});
router.get('/hot_artist', function(req, res, next) {
	let page = req.query.page||0;
	res.type("text/javascript");
    let param = _page_and_param.hot_artist;
    _redis.get_form_list(param.key,page).then((redis_result => {
        if (redis_result) {
            console.log("hot artist in redis");
        	res.end(redis_result);
            return;
        } else {
            console.log("hot artist in network");
            QUERY_UTIL.Net_getHotArtist().then((hot_result) => {
            	res.end(hot_result);
            	_redis.save
            });
            http_redis.request_hot_artist();
            return;
        }
    }));

});

module.exports = router;