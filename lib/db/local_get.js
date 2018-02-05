let _request = require('request');
let _db = require('./mydb');
let _music_url = require('./../net/music_url');
let demo = {
    get_list(offset = 0, limit = 100) {
        let url = _music_url.QUERY_ARTIST_LIST + "offset=" + offset + "&limit=" + limit;
        console.log(url);
        return new Promise((resolve, reject) => {
            _request(url, (error, response, body) => {
                if (error || response.statusCode != 200) {
                    console.log("error in get list");
                    reject();
                    return;
                } else {
                    resolve(body);
                }
            });
        });
    },
    get_artist_by_id(tinguid, artistid) {
        let url = _music_url.QUERY_ARTISTS_INFO + "tinguid=" + tinguid + "&artistid=" + artistid;
        _request(url, (error, response, body) => {
            if (error || response.statusCode != 200) {
                console.log("error in get artistInfo by id");
                // reject();
                return;
            } else {
                // reslove(body);
                let obj = JSON.parse(body);
                obj._id = obj.ting_uid;
                _db.insertData("artistInfo", obj);
                console.log("save success")
            }
        });
    }
}

if (!global.db_local_get) {
    global.db_local_get = demo;
}
module.exports = global.db_local_get;