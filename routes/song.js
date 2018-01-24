var express = require('express');
var router = express.Router();
const QUERY_UTIL = require('./../lib/net/get_data');//网络请求
// const _query_db = require('./../lib/db/query_db');
const _redis = require('./../lib/redis/redis_util');//获取redis
let http_redis = require('./../lib/redis/http_redis');// 请求完整数据并且保存到数据库
let _page_and_param = require('./../lib/redis/page_and_param');// 获取配置参数
router.get('/new_song', function(req, res, next) {
	let param = _page_param.new_song;
	let result_obj = {};
	_redis.get_form_list(param.redis_name).then((name_result)=>{
		if (name_result) {

		}else{
			QUERY_UTIL.
		}
	});
});

module.exports = router;