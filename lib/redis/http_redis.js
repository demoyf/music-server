let _get_data = require('./../net/get_data');
let _redis = require('./redis_util');
let _key_type = require('./key_type');
let demo = {
    request_billboard_data_save(type) {
        if (!type) {
            let temp = _key_type["type_" + 1];
            _get_data.NET_getBillBoardByType(temp.type, 0, 3000).then((body) => {
                this._save_data(body, temp.key);
            });
        } else {
        	// 每一次只有一百条而已。。。
            for (let key in _key_type) {
                let temp = _key_type[key];
                _get_data.NET_getBillBoardByType(temp.type, 0, 3000).then((body) => {
                    this._save_data(body, temp.key);
                });
            }
        }
    },
    _save_data(data, key) {
        console.log("in here");
        let obj = JSON.parse(data);	
        console.log(key+":"+obj.song_list.length);
    }
}
module.exports = demo;