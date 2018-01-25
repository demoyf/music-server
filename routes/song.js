var express = require('express');
var router = express.Router();
const QUERY_UTIL = require('./../lib/net/get_data'); //网络请求
// const _query_db = require('./../lib/db/query_db');
const _redis = require('./../lib/redis/redis_util'); //获取redis
let http_redis = require('./../lib/redis/http_redis'); // 请求完整数据并且保存到数据库
let _page_and_param = require('./../lib/redis/page_and_param'); // 获取配置参数
let _db_key = require('./../lib/db/db_key');
let _my_db = require('./../lib/db/mydb');
router.get('/new_song', function(req, res, next) {
    let param = _page_and_param.new_song;
    let page = req.query.page || 0;
    let result_obj = {};
    res.type("text/javascript");
    _redis.getStringByKey(param.redis_name).then((name_result) => {
        if (name_result) {
            result_obj.name = JSON.parse(name_result);
            _redis.get_form_list(param.key, page).then((song_result) => {
                if (song_result) {
                    result_obj.song_list = JSON.parse(song_result);
                    console.log('new song in redis');
                    res.end(JSON.stringify(result_obj));
                    return;
                } else {
                    QUERY_UTIL.NET_getNewSong().then((net_song) => {
                        console.log('new song in net');
                        res.end(net_song);
                        http_redis.request_new_song();
                        return;
                    });
                }
            });
            return;
        } else {
            QUERY_UTIL.NET_getNewSong().then((net_song) => {
                console.log('new song in net');
                res.end(net_song);
                http_redis.request_new_song();
            });
        }
    });
});
router.get('/get_song/:song_id', function(req, res, next) {
    let song_id = req.params.song_id;
    let key = _db_key.song;
    res.type("text/json");
    _my_db.queryData(key.collection, { _id: song_id }).then((data) => {
        if (data) {
            console.log("song in db")
            res.end(JSON.stringify(data));
        } else {
            QUERY_UTIL.net_get_song(song_id).then((song_data) => {
                if (song_data) {
                    console.log("song in net");
                    res.end(JSON.stringify(song_data));
                    let temp = JSON.parse(song_data);
                    temp._id = temp.songinfo.song_id;
                    _my_db.insertData(key.collection, temp);
                    return;
                } else {
                    res.end("not found");
                }
            });
        }
    });
});
module.exports = router;