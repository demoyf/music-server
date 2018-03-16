var express = require('express');
var router = express.Router();
const QUERY_UTIL = require('./../lib/net/get_data');
// const SLOVE_DATA = require('./../lib/slove/slove_data');
/* GET home page. */
const _query_db = require('./../lib/db/mydb');
const _redis = require('./../lib/redis/redis_util');
let http_redis = require('./../lib/redis/http_redis');
let _page_and_param = require('./../lib/redis/page_and_param');
let _db_key = require('./../lib/db/db_key');
let _local_get = require('./../lib/db/local_get');
let _music_url = require('./../lib/net/music_url');
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
    res.type("text/json");
    let param = _page_and_param.hot_artist;
    // http_redis.request_hot_artist();
    // res.end("123");
    let artist_obj = {};
    _redis.getStringByKey(param.redis_name).then((name_result) => {
        if (name_result) {
            artist_obj.name = JSON.parse(name_result);
            _redis.get_form_list(param.key, page).then((redis_result) => {
                if (redis_result) {
                    artist_obj.artist = JSON.parse(redis_result);
                    res.end(JSON.stringify(artist_obj));
                    return;
                } else {
                    my_get_data();
                }
            });
        } else {
            my_get_data();
        }
    });
    function my_get_data(){
      QUERY_UTIL.Net_getHotArtist().then((hot_result) => {
          let data = JSON.parse(hot_result);
          let name = {
            name:"热门歌手",
            page_num:data.artist.length%20==0?data.artist.length/20:Math.floor(data.artist.length/20)+1
          }
          let obj = {
            artist:hot_result.slice(0,20),
            name:name
          }
          res.end(JSON.stringify(obj));
      });
      http_redis.request_hot_artist();
      return;
    }
});

router.get('/get_artist/:ting/:artist', function(req, res, next) {
    let ting_uid = req.params.ting;
    let artist_id = req.params.artist;
    let key = _db_key.artist_db;
    let query = key.query;
    query.ting_uid = ting_uid;
    query.artist_id = artist_id;
    res.type("text/json");
    _query_db.queryData(key.collection, query).then((db_data) => {
        if (db_data) {
            console.log("artist in db");
            res.end(JSON.stringify(db_data));
            return;
        } else {
            let url = _music_url.QUERY_ARTISTS_INFO + "tinguid=" + ting_uid + "&artistid=" + artist_id;
            console.log(url);
            QUERY_UTIL.net_request(url, false).then((data) => {
                console.log("artist in net");
                if (data) {
                    res.end(data);
                    let temp = JSON.parse(data);
                    temp._id = temp.ting_uid;
                    _query_db.insertData(key.collection, temp);
                } else {
                    res.end("error");
                }
            }).catch((error) => {
                console.log("error");
                res.end(JSON.stringify(error));
            });
        }
    });
});
module.exports = router;
