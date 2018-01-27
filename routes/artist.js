var express = require('express');
var router = express.Router();
const QUERY_UTIL = require('./../lib/net/get_data');
// const SLOVE_DATA = require('./../lib/slove/slove_data');
/* GET home page. */
const _query_db = require('./../lib/db/query_db');
const _redis = require('./../lib/redis/redis_util');
let http_redis = require('./../lib/redis/http_redis');
let _page_and_param = require('./../lib/redis/page_and_param');
let _local_get = require('./../lib/db/local_get');
/*router.get('/', function(req, res, next) {
    _local_get.get_list(2000).then((result) => {
        let artists = JSON.parse(result).artist;
        console.log(artists.length);
        res.end(result);
        artists.forEach((item) => {
            _local_get.get_artist_by_id(item.ting_uid, item.artist_id);
        });
    });
});*/
router.get('/hot_artist', function(req, res, next) {
    let page = req.query.page || 0;
    res.type("text/javascript");
    let param = _page_and_param.hot_artist;
    // http_redis.request_hot_artist();
    // res.end("123");
    let artist_obj = {};
    _redis.getStringByKey(param.redis_name).then((name_result) => {
            if (name_result) {
                artist_obj.name = JSON.parse(name_result);
                _redis.get_form_list(param.key, 1).then((redis_result) => {
                    if (redis_result) {
                        console.log("hot artist in redis");
                        artist_obj.artist = JSON.parse(redis_result);
                        res.end(JSON.stringify(artist_obj));
                        return;
                    } else {
                        console.log("hot artist in network");
                        QUERY_UTIL.Net_getHotArtist().then((hot_result) => {
                            res.end(hot_result);
                        });
                        http_redis.request_hot_artist();
                        return;
                    }
                }));
        } else {
            console.log("hot artist in network");
            QUERY_UTIL.Net_getHotArtist().then((hot_result) => {
                res.end(hot_result);
            });
            http_redis.request_hot_artist();
            return;
        }
    });
});

router.get('/get_artist/:ting', function(req, res, next) {
    console.log(req.params.ting);
    res.end("123");
});
module.exports = router;