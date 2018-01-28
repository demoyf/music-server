let express = require('express');
let router = express.Router();
let _param_key = require('./../lib/redis/page_and_param');
let _redis = require('./../lib/redis/redis_util');
let _music_url = require('./../lib/net/music_url');
let _http = require('./../lib/net/get_data');
let _db = require('./../lib/db/')
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
router.get('./artist_album',(req,res,next)=>{

});

router.get('/album_info/:album_id',(req,res,next)=>{
	let album_id = req.params.album_id;

	let url = _music_url.QUERY_ALBUM_INFO+"album_id="+album_id;

});
module.exports = router;