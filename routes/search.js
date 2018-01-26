let express = require('express');
let iconv = require('iconv-lite');
let router = express.Router();
let _http = require('./../lib/net/get_data');
let _music_url = require('./../lib/net/music_url');
router.get('/suggesstion', function(req, res, next) {
    let query = req.query.query;
    res.type("text/javascript");
    let url = _music_url.QUERY_SRARCH_SUGGESSTIONS + "query=" + query;

    _http.net_request(url).then((suggesstion_result) => {
        res.end(suggesstion_result);
    });
});

module.exports = router;