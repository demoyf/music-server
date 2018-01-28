let express = require('express');
let router = express.Router();
let _param_key = require('./../lib/redis/page_and_param');
let _redis = require('./../lib/redis/redis_util');
router.get('/new_album',(req,res,next)=>{
	let key = _param_key.new_album_redis;
	_redis.getStringByKey(key.key).then((redis_album)=>{
		if(redis_album){

		}else{
			
		}
	});
});

module.exports = router;