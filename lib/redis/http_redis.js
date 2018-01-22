let _get_data = require('./../net/get_data');
let _redis = require('./redis_util');
let _key_type = require('./key_type');
let _page_param = require('./page_and_param');
let demo = {
    request_billboard_data_save(type) {
        if (!type) {
            let temp = _key_type[("type_" + 16)];
            _get_data.NET_getBillBoardByType(temp.type, 0, 3000).then((body) => {
                _redis.remove(key);
                this._save_data(body, temp.key, temp.type);
            });
        } else {
            // 一次最多100行数据
            for (let key in _key_type) {
                let temp = _key_type[key];
                _get_data.NET_getBillBoardByType(temp.type, 0, 100).then((body) => {
                    _redis.remove(key);
                    this._save_data(body, temp.key, type);
                });
            }
        }
    },
    _save_data(data, key, type, offset = 20) {
        let result = JSON.parse(data);
        let arr = result.song_list;
        let length = arr.length || 0;
        let page = 0;
        while (arr.length > 0) {
            let obj = arr.splice(0, offset);
            _redis.saveBillBoardToRedis(("type_" + type), page, JSON.stringify(obj));
            page++;
        }
        let str_obj = {
            name: result.billboard.name == null ? _key_type[("type_" + type)].name : result.billboard.name,
            time: result.billboard.update_date,
            page_num: page
        }
        _redis.saveStringByKey((key + "_name"), JSON.stringify(str_obj));
    },
    request_hot_artist() {
        let item = _page_param.hot_artist;
        _get_data.Net_getHotArtist().then((artist_list) => {
            if (artist_list) {
                this._save_into_redis(item.key, artist_list, item.page_num,
                    {which_data:item.data_key_in_json,name:item.name});
            }
        });
    },
    _save_into_redis(key, data, page_num = 20,option) {
        let result = JSON.parse(data);
        let arr = result[option.which_data];
        let length = arr.length || 0;
        let page = 0;
        while (arr.length > 0) {
            let obj = arr.splice(0, page_num);
            _redis.save_into_list(key, page, JSON.stringify(obj));
            page++;
        }
        let str_obj = {
            name: option.name,
            page_num: page
        }
        _redis.saveStringByKey((key + "_name"), JSON.stringify(str_obj));
    }
}
module.exports = demo;