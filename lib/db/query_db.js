const DB = require('./../db/mydb');
let demo = {
    DB_getAritstByTingUID(tinguid) {
        // 这个存在mongodb就行了，不用redis。
        let promise = DB.queryData('artistInfo', { 'ting_uid': tinguid });
        return promise;
    },
    sloveArtistAndInsert(obj) {
        // obj._id = obj.ting_uid;
        // console.log();
        let result = JSON.parse(obj);
        result._id = parseInt(result.ting_uid);
        DB.insertData("artistInfo", result);
    }
}