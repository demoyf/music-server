let express = require('express');
let iconv = require('iconv-lite');
let router = express.Router();
let _http = require('./../lib/net/get_data');
let _redis = require('./../lib/redis/redis_util');
let _music_url = require('./../lib/net/music_url');
router.get('/suggesstion/:query', function(req, res, next) {
    let query = req.params.query;
    res.type("text/json");
    let url = _music_url.QUERY_SRARCH_SUGGESSTIONS + "query=" + query;
    _http.net_request(url).then((suggesstion_result) => {
        res.end(suggesstion_result);
    });
});
router.get('/all/:query/:type', function(req, res, next) {
    let query = req.params.query;
    let type = req.params.type;
    res.type('text/json');
    _redis.getStringByKey(query.toString() + "_" + type).then((redis_result) => {
        if (redis_result) {
            console.log("search in redis");
            res.end(JSON.parse(redis_result));
            return;
        } else {
            let url = _music_url.QUERY_SEARCH_ALL_URL + "query=" + query + "&type=" + type+"&limit=100";
            _http.net_request(url).then((search_result) => {
                console.log('search in net');
                res.end(search_result);
                _redis.saveStringByKey(query.toString() + "_" + type, JSON.stringify(search_result), 10);
            });
        }
    });
});
module.exports = router;
