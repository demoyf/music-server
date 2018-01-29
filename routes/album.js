let express = require('express');
let router = express.Router();
let _param_key = require('./../lib/redis/page_and_param');
let _redis = require('./../lib/redis/redis_util');
let _music_url = require('./../lib/net/music_url');
let _http = require('./../lib/net/get_data');
let _db = require('./../lib/db/mydb');
let _db_key = require('./../lib/db/db_key');
router.get('/new_album',(req,res,next)=>{
	let key = _param_key.new_album_redis;
	res.type('text/json');
	_redis.getStringByKey(key.key).then((redis_album)=>{
		if(redis_album){
			console.log("album in redis");
			res.end(JSON.parse(redis_album));
			return;
		}else{
			let url = _music_url.QUERY_RECOMMEND;
			_http.net_request(url,false).then((net_album)=>{
				console.log("album in net");
				res.end(net_album);
				_redis.saveStringByKey(key.key,JSON.stringify(net_album));
			});
		}
	});
});
router.get('/artist_album/:ting_uid',(req,res,next)=>{
	let ting_uid = req.params.ting_uid;
	_redis.getStringByKey("artist_album_"+ting_uid).then((redis_data)=>{
		if (redis_data) {
			res.end(JSON.parse(redis_data));
			return;
		}else{
			let url = _music_url.QUERY_ARTIST_ALBUM_URL+"tinguid="+ting_uid+"&limits="+20;
			_http.net_request(url,false).then((net_artist_album)=>{
				if (net_artist_album) {
					res.end(net_artist_album);
					
				}
			})
		}
	});
});

router.get('/album_info/:album_id',(req,res,next)=>{
	let album_id = req.params.album_id;
	let collection_key = _db_key.album_info;
	res.type("text/json");
	_db.queryData(collection_key.collection,{"_id":album_id}).then((db_album)=>{
		if(db_album){
			console.log("album in db");
			res.end(JSON.stringify(db_album));
			return;
		}else{	
			let url = _music_url.QUERY_ALBUM_INFO+"album_id="+album_id;
			_http.net_request(url,false).then((net_album)=>{
				console.log("album in net");
				res.end(net_album);
				let temp = JSON.parse(net_album);
				temp._id = temp.albumInfo.album_id;
				_db.insertData(collection_key.collection,temp);
			});
		}
	});
});
module.exports = router;