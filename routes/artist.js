var express = require('express');
var router = express.Router();
const QUERY_UTIL = require('./../lib/net/get_data');
// const SLOVE_DATA = require('./../lib/slove/slove_data');
/* GET home page. */
const _query_db = require('./../lib/db/query_db');
const _redis = require('./../lib/redis/redis_util');
router.get('/', function(req, res, next) {
 	let id = req.query.tinguid;
 	if (!id) {
 		id = 1052;
 	}
 	let result = _query_db.DB_getAritstByTingUID(id);
 	res.type("text/javascript");
 	result.then(function(data){
 		if (data) {
 			console.log("read in db");
 			res.json(data);
 		}else{
 			let temp = QUERY_UTIL.NET_getAritstByTingUID(id);
 			temp.then(function(data){
 				res.setHeader('charset',"utf-8");
 				res.end(data);
 				_query_db.sloveArtistAndInsert(data);
 			});
 		}
 	});
});
router.get('/hot_list',function(req,res,next){
	QUERY_UTIL.Net_getHotArtist().then((hot_result)=>{

	});
});

module.exports = router;
