// consst http = require('http');
const _REQUEST = require('request');
const URL = require('./music_url');
let requsetObj = {
    NET_getSearchResult(query, type = -1) {
        let url = (URL.QUERY_SEARCH_ALL_URL + "type=" + type + "&query=" + query);
            url = encodeURI(url);
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
                url = encodeURI(url);
            _REQUEST(url, (error, response, body) => {
                if (error || response.statusCode != 200) {
                    reject();
                    return;
                } else {
                    reslove(body);
                }
            });
        });
    },
    NET_getBillBoardByType(type = 1, offset = 0, size = 10) {
        return new Promise((reslove, reject) => {
            let url = URL.QUERY_BILL_BOARD + "type=" + type + "&offset=" + offset + "&size=" + size;
                url = encodeURI(url);
            _REQUEST(url, function(error, response, body) {
                if (error || response.statusCode != 200) {
                    reject();
                    return;
                } else {
                    reslove(body);
                    return;
                }
            });
        })
    },
    Net_getHotArtist() {
        let url = URL.QUERY_HOT_ARITIS;
            url = encodeURI(url);
        return new Promise((reslove, reject) => {
            _REQUEST(url, (error, response, body) => {
                if (error || response.statusCode != 200) {
                    console.log("err in get bill board");
                    reject();
                    return;
                } else {
                    reslove(body);
                }
            });
        });
    },
    NET_getNewSong() {
        let url = URL.QUERY_NEW_SONG;
            url = encodeURI(url);
        return new Promise((reslove, reject) => {
            _REQUEST(url, (error, response, body) => {
                if (error || response.statusCode != 200) {
                    console.log("err in get bill board");
                    reject();
                    return;
                } else {
                    reslove(body);
                }
            });
        });
    },
    net_get_song(songid) {
        let url = URL.PLAY_URL + "songid=" + songid;
            url = encodeURI(url);
        return new Promise((reslove, reject) => {
            _REQUEST(url, (error, response, body) => {
                if (error || response.statusCode != 200) {
                    console.log("err in get song");
                    reject();
                    return;
                } else {
                    reslove(body);
                }
            });
        });
    },
    net_request(url) {
        url = encodeURI(url);
        return new Promise((reslove, reject) => {
            _REQUEST(url, (error, response, body) => {
                if (error || response.statusCode != 200) {
                    console.log("err in get song");
                    reject();
                    return;
                } else {
                    reslove(body);
                }
            });
        });
    }
}
module.exports = requsetObj;