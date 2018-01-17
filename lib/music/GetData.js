// consst http = require('http');
const _REQUEST = require('request');
const BPromise = require("bluebird");
const URL = require('./music_url');
const DB = require('./../db/mydb');
let requsetObj = {
	getSearchResult(query,type=-1){
		let url = (URL.QUERY_SEARCH_ALL_URL+"type="+type+"&query="+query);
		_REQUEST(url,(error,response,body)=>{
			if (error||response.statusCode!=200) {
				console.log(url);
			}else{
				
			}
		});
	},
	DB_getAritstByTingUID(tinguid){
		let promise = DB.queryData('artistInfo',{'ting_uid':tinguid});
		return promise;
	},
	NET_getAritstByTingUID(tinguid){
		return new Promise(function(reslove,reject){
		let url = URL.QUERY_ARTISTS_INFO+"tinguid="+tinguid;
		_REQUEST(url,(error,response,body)=>{
			if (error||response.statusCode!=200) {
				console.log("error in get artistInfo by id");
				reject();
			}else{
				reslove(body);
			}
		});
	});
	}
}
module.exports = requsetObj;