var express = require('express');
var router = express.Router();
const QUERY_UTIL = require('./../lib/net/get_data');
const SLOVE_DATA = require('./../lib/slove/slove_data');
/* GET home page. */
router.get('/', function(req, res, next) {
 	let id = req.query.tinguid;
 	if (!id) {
 		id = 1052;
 	}
 	let result = QUERY_UTIL.DB_getAritstByTingUID(id);
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
 				SLOVE_DATA.sloveArtistAndInsert(data);
 			});
 		}
 	});
});
router.get('/hot_list',function(req,res,next){
	
});

module.exports = router;
