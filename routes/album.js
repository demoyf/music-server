let express = require('express');
let router = express.Router();
let _param_key = require('./../lib/redis/page_and_param');
let _redis = require('./../lib/redis/redis_util');
let _music_url = require('./../lib/net/music_url');
let _http = require('./../lib/net/get_data');
let _db = require('./../lib/db/mydb');
let _db_key = require('./../lib/db/db_key');
let _http_redis = require('./../lib/redis/http_redis');
router.get('/new_album', (req, res, next) => {
    let key = _param_key.new_album_redis;
    res.type('text/json');
    _redis.getStringByKey(key.key).then((redis_album) => {
        if (redis_album) {
            res.end(JSON.parse(redis_album));
            return;
        } else {
            let url = _music_url.QUERY_RECOMMEND;
            _http.net_request(url, false).then((net_album) => {
                console.log("album in net");
                res.end(net_album);
                _redis.saveStringByKey(key.key, JSON.stringify(net_album));
            });
        }
    });
});
router.get('/artist_album/:ting_uid/:page', (req, res, next) => {
    let ting_uid = req.params.ting_uid;
    let param = _param_key.artist_album_redis;
    let page = parseInt(req.params.page);
    param.key = param.key + ting_uid;
    param.redis_name = param.redis_name + ting_uid;
    let obj = {};
    res.type("text/json");
    _redis.getStringByKey(param.redis_name).then((redis_name_data) => {
        if (redis_name_data) {
            obj.page_info = JSON.parse(redis_name_data);
            _redis.get_form_list(param.key, page - 1).then((redis_data) => {
                if (redis_data) {
                    obj.albumlist = JSON.parse(redis_data);
                    res.end(JSON.stringify(obj));
                    return;
                } else {
                    net_get();
                }
            });
            return;
        } else {
            net_get();
        }
    }).catch(() => {
        let temp = {
            page_info: {
                page_num: 0,
                page: 0
            }
        }
        res.end(JSON.stringify(temp));
    })

    // 没有数据，获取并且存储到redis
    function net_get() {
        // 一个url负责后续的redis存储，一个是获取一个临时的数据
        let temp_url = _music_url.QUERY_ARTIST_ALBUM_URL + "tinguid=" + ting_uid + "&limits=" + 100;
        let url = temp_url + "&limits=" + 20;
        _http.net_request(temp_url, false).then((net_artist_album) => {
            if (net_artist_album) {
                let temp = JSON.parse(net_artist_album);
                // 最多只能获取到60条，那就只60条
                let artist_album_total = temp.albumnums > 60 ? 60 : temp.albumnums;
                let param_page = param.page_num;
                let res_page = artist_album_total % param_page == 0 ?
                    artist_album_total / param_page : Math.floor(artist_album_total / param_page) + 1
                let name = {
                    page_num: param_page,
                    page: res_page
                }
                temp.page_info = name;
                res.end(JSON.stringify(temp));
                _http_redis.request_artist_album(temp_url, param);
            } else {
                let temp = {
                    page_info: {
                        page_num: 0,
                        page: 0
                    }
                }
                res.end(JSON.stringify(temp));
            }
        }).catch(() => {
            let temp = {
                page_info: {
                    page_num: 0,
                    page: 0
                }
            }
            res.end(JSON.stringify(temp));
        })
    }
});

router.get('/album_info/:album_id', (req, res, next) => {
    let album_id = req.params.album_id;
    let collection_key = _db_key.album_info;
    res.type("text/json");
    _db.queryData(collection_key.collection, { "_id": album_id }).then((db_album) => {
        if (db_album) {
            console.log("album in db");
            res.end(JSON.stringify(db_album));
            return;
        } else {
            let url = _music_url.QUERY_ALBUM_INFO + "album_id=" + album_id;
            _http.net_request(url, false).then((net_album) => {
                console.log("album in net");
                res.end(net_album);
                let temp = JSON.parse(net_album);
                temp._id = temp.albumInfo.album_id;
                _db.insertData(collection_key.collection, temp);
            });
        }
    });
});
module.exports = router;
