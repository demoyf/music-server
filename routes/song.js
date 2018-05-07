var express = require('express');
var router = express.Router();
const QUERY_UTIL = require('./../lib/net/get_data'); //网络请求
// const _query_db = require('./../lib/db/query_db');
const _redis = require('./../lib/redis/redis_util'); //获取redis
let http_redis = require('./../lib/redis/http_redis'); // 请求完整数据并且保存到数据库
let _page_and_param = require('./../lib/redis/page_and_param'); // 获取配置参数
let _db_key = require('./../lib/db/db_key');
let _my_db = require('./../lib/db/mydb');
let _music_url = require('./../lib/net/music_url');
const path = require('path');
const fs = require('fs');
const _REQUEST = require('request');
// 新歌速递
router.get('/new_song/:page', function(req, res, next) {
    let param = _page_and_param.new_song;
    let page = req.params.page || 0;
    let result_obj = {};
    res.type("text/json");
    _redis.getStringByKey(param.redis_name).then((name_result) => {
        if (name_result) {
            result_obj.name = JSON.parse(name_result);
            _redis.get_form_list(param.key, (page - 1)).then((song_result) => {
                if (song_result) {
                    result_obj.song_list = JSON.parse(song_result);
                    res.end(JSON.stringify(result_obj));
                    return;
                } else {
                    get_data();
                }
            });
            return;
        } else {
            get_data();
        }
    });
    function get_data() {
        QUERY_UTIL.NET_getNewSong().then((net_song) => {
            let temp = JSON.parse(net_song);
            let length = temp.song_list.length;
            temp.name = {
                page_num: length % 20 == 0 ? length / 20 : Math.floor(length / 20) + 1,
                name: "新歌速递"
            }
            res.end(JSON.stringify(temp));
            http_redis.request_new_song();
        });
    }
});
// id获取歌曲
router.get('/get_song/:song_id', function(req, res, next) {
    let song_id = req.params.song_id;
    let key = _db_key.song;
    res.type("text/json");
    _my_db.queryData(key.collection, { _id: song_id }).then((data) => {
        if (data) {
            res.end(JSON.stringify(data));
        } else {
          QUERY_UTIL.net_get_song(song_id).then((song_data) => {
              if (song_data) {
                  let temp = JSON.parse(song_data);
                  temp._id = temp.songinfo.song_id;
                  var filePath = path.join(__dirname, './../../Apache24/htdocs/music/')+song_id+".mp3";
                  _REQUEST(temp.bitrate.file_link).
                  pipe(fs.createWriteStream(filePath,{flags:'w'})).
                  on('close',()=>{
                    temp.bitrate.show_link = "http://106.14.13.168/music/"+song_id+".mp3";
                    res.end(JSON.stringify(temp));
                    _my_db.insertData(key.collection, temp);
                  });
              } else {
                  res.end("not found");
              }
          });
        }
    });
});
// tinguid,artistid
router.get('/song_list/:tinguid/:artistid/:page', function(req, res, next) {
    let tinguid = req.params.tinguid;
    let artistid = req.params.artistid;
    let page = req.params.page;
    let search_key = tinguid + "_" + artistid;
    let name_search_key = tinguid + "_" + artistid + "_name";
    let offset = (page - 1) * 20;
    let limit = 20;
    res.type("text/json");
    let obj = {};
    _redis.getStringByKey(name_search_key).then((name_result) => {
        if (name_result) {
            obj.page_info = JSON.parse(name_result);
            _redis.get_form_list(search_key, page - 1).then((song_result) => {
                console.log("song list in redis");
                if (song_result) {
                    obj.songlist = JSON.parse(song_result);
                    res.end(JSON.stringify(obj));
                } else {
                    get_net_data();
                }
            });
        } else {
            get_net_data();
        }
    });

    function get_net_data() {
        console.log("song list in net");
        let temp_url = _music_url.QUERY_SONG_LIST_BY_TING_UID + "tinguid=" +
            tinguid + "&artistid=" + artistid;
        let url = temp_url + "&offset=" + offset + "&limits=" + limit;
        QUERY_UTIL.net_request(url, false).then((song_list_data) => {
            let temp = JSON.parse(song_list_data);
            let length = temp.songnums > 100 ? 100 : temp.songnums;
            let page = (length % 20 == 0 ? (length / 20) : Math.floor(length / 20) + 1);
            temp.page_info = {
                page_num: page
            }
            res.end(JSON.stringify(temp));
            let artist_album_redis = {
                key: search_key,
                data_key_in_json: "songlist",
                page_num: 20,
                redis_name: name_search_key,
                name: "歌手歌曲列表"
            }
            http_redis.requset_artist_song_list(temp_url, artist_album_redis);
        });
    }
});
// router.get('/music/:song_id',(req, res, next)=>{
//   let song_id = req.params.song_id;
//   var filePath = path.join(__dirname, './../music/')+song_id+".mp3";
//   let fReadStream = fs.createReadStream(filePath);
//   let length = 0;
//   fReadStream.on("data",(chunk) =>{
//     res.write(chunk,"binary")
//   });
//   fReadStream.on("end",function () {
//     res.end();
//   });
// })
module.exports = router;
