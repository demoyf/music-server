const DB = require("./../db/mydb");

let demo = {
	sloveArtistAndInsert(obj){
		// obj._id = obj.ting_uid;
		// console.log();
		let result = JSON.parse(obj);
		result._id = parseInt(result.ting_uid);
		DB.insertData("artistInfo",result);
	}
}

module.exports = demo;