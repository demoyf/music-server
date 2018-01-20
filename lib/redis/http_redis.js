let _get_data = require('./../net/get_data');
let _redis = require('./redis_util');
let _key_type = require('./key_type');
let demo = {
    request_billboard_data_save(type) {
        if (!type) {
            let temp = _key_type[("type_" + 16)];
            _get_data.NET_getBillBoardByType(temp.type, 0, 3000).then((body) => {
                this._save_data(body, temp.key,temp.type);
            });
        } else {
        	// 一次最多100行数据
            for (let key in _key_type) {
                let temp = _key_type[key];
                _get_data.NET_getBillBoardByType(temp.type, 0, 100).then((body) => {
                    this._save_data(body, temp.key,type);
                });
            }
        }
    },
    _save_data(data, key,type) {
        let result = JSON.parse(data);
        let arr = result.song_list;
        let length = arr.length||0;
        let offset = 20;
        let str_obj = {
            name:result.billboard.name==null?_key_type[("type_"+type)].name:result.billboard.name,
            time:result.billboard.update_date
        }
        _redis.saveStringByKey((key+"_name"),JSON.stringify(str_obj));
        while(arr.length>0){
            let obj = arr.splice(0,offset);
            _redis.saveBillBoardToRedis(("type_"+type),JSON.stringify(obj));
        }
    }
}
module.exports = demo;