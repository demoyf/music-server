// consst http = require('http');
const _REQUEST = require('request');
const URL = require('./music_url');
let requsetObj = {
    NET_getSearchResult(query, type = -1) {
        let url = (URL.QUERY_SEARCH_ALL_URL + "type=" + type + "&query=" + query);
        _REQUEST(url, (error, response, body) => {
            if (error || response.statusCode != 200) {
                console.log(url);
            } else {

            }
        });
    },
    NET_getAritstByTingUID(tinguid) {
        return new Promise(function(reslove, reject) {
            let url = URL.QUERY_ARTISTS_INFO + "tinguid=" + tinguid;
            _REQUEST(url, (error, response, body) => {
                if (error || response.statusCode != 200) {
                    console.log("error in get artistInfo by id");
                    reject();
                } else {
                    reslove(body);
                }
            });
        });
    },
    NET_getBillBoardByType(type = 1, offset = 0, size = 10) {
        console.log(type + "," + offset + "," + size);
        return new Promise((reslove, reject) => {
            let url = URL.QUERY_BILL_BOARD + "type=" + type + "&offset=" + offset + "&size=" + size;
            _REQUEST(url, (error, response, body) => {
                if (error || response.statusCode != 200) {
                    console.log("err in get bill board");
                    reject();
                } else {
                    reslove(body);
                }
            })
        })
    },
    Net_getHotArtist(){
        return new Promise((reslove, reject) => {
            let url = URL.QUERY_HOT_ARITIS;
            _REQUEST(url, (err, response, body) => {
                if (error || response.statusCode != 200) {
                    console.log("err in get bill board");
                    reject();
                } else {
                    reslove(body);
                }
            })
        });
    });
}
}
module.exports = requsetObj;