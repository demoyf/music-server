let _get_data = require('./../net/get_data');
let _redis = require('./redis_util');
let _key_type = require('./key_type');
let _page_param = require('./page_and_param');
let demo = {
    // 三个方法，请求了billboard
    request_billboard_data_save(type) {
        if (type) {
            let key_and_type = _key_type[("type_" + 1)];
            _get_data.NET_getBillBoardByType(key_and_type.type, 0, 3000).then((body) => {
                _redis.remove(key_and_type.key);
                this._save_data(body, key_and_type);
            });
        } else {
            // 一次最多100行数据
            for (let key in _key_type) {
                let key_and_type = _key_type[key];
                this.net_get(key_and_type);
            }
        }
    },
    net_get(key_and_type) {
        let self = this;
        _get_data.NET_getBillBoardByType(key_and_type.type, 0, 100).then(function(body) {
            if (body) {
                _redis.remove(key_and_type.key);
                self._save_data(body, key_and_type, key_and_type.offset);
            }
        });
    },
    _save_data(data, key_and_type, offset = 20) {
        // return;
        let result = JSON.parse(data);
        let arr = result.song_list;
        let length = arr.length || 0;
        if (arr.length == 0) {
            return;
        }
        let page = 0;
        for (let i = 0; i < arr.length; i += offset) {
            let obj = arr.slice(i, i + offset); 
            page++;
            _redis.saveBillBoardToRedis(key_and_type.key, JSON.stringify(obj));
        }
        let str_obj = {
            name: result.billboard.name == null ? key_and_type.real_name : result.billboard.name,
            time: result.billboard.update_date,
            page_num: page
        }
        _redis.saveStringByKey(key_and_type.name, JSON.stringify(str_obj));
    },
    // 获取热门歌手
    request_hot_artist() {
        let item = _page_param.hot_artist;
        _get_data.Net_getHotArtist().then((artist_list) => {
            if (artist_list) {
                this._save_into_redis(item.key, artist_list, item.page_num, {
                    which_data: item.data_key_in_json,
                    name: item.name,
                    redis_name: item.redis_name
                });
            }
        });
    },
    // 新歌速递
    request_new_song() {
        let item = _page_param.new_song;
        _get_data.NET_getNewSong().then((song_list) => {
            if (song_list) {
                this._save_into_redis(item.key, song_list, item.page_num, {
                    which_data: item.data_key_in_json,
                    name: item.name,
                    redis_name: item.redis_name
                });
            }
        });
    },
    request_artist_album(url, param) {
        _get_data.net_request(url,false).then((data) => {
            if (data) {
                this._save_into_redis(param.key, data, param.page_num, {
                    which_data: param.data_key_in_json,
                    name: param.name,
                    redis_name: param.redis_name
                });
            }
        });
    },
    requset_artist_song_list(url,param){
        _get_data.net_request(url,false).then((data) => {
            if (data) {
                this._save_into_redis(param.key, data, param.page_num, {
                    which_data: param.data_key_in_json,
                    name: param.name,
                    redis_name: param.redis_name
                });
            }
        });
    },
    _save_into_redis(key, data, page_num = 20, option) {
        let result = JSON.parse(data);
        let arr = result[option.which_data];
        let length = arr.length || 0;
        if (length == 0) {
            return;
        }
        let page = -1;
        _redis.remove(key);
        for (let i = 0; i < length; i += page_num) {
            let obj = arr.slice(i, i + page_num);
            page++;
            _redis.save_into_list(key, JSON.stringify(obj));
        }
        console.log(length);
        let str_obj = {
            name: option.name,
            page_num: (page + 1)
        }
        _redis.saveStringByKey(option.redis_name, JSON.stringify(str_obj));
    }
}
module.exports = demo;