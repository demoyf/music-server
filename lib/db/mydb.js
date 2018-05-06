const MONGO_CLIENT = require('mongodb').MongoClient;
const CONNECT_STR = require('./config').DB_CONNECT_STR;
let db_controll = {
    _music_db: null,
    connect: function(callback) {
        // console.log(CLIENT);
        let self = this;
        if (MONGO_CLIENT) {
            MONGO_CLIENT.connect(CONNECT_STR, function(err, client) {
                if (err) {
                    console.log(err);
                    return;
                }
                self._music_db = client.db('music');
            });
        } else {
            console.log("hasn't client");
        }
    },
    insertData: function(which, list, callback) {
        let db = this._music_db;
        let collection = db.collection(which);
        // db.insertData()
        collection.insert(list, function(err, result) {
            if (err) {
                // console.log(err);
                if (callback) {
                    callback(err, result);
                }
            } else {
                if (callback) {
                    callback(null, result);
                }
            }
        });
    },
    check_and_create(which){
      let db = this._music_db;
      let collection = db.collection(which);
      if(!collection){
        db.createCollection(which);
      }
      return true;
    },
    getId(which){
      let db = this._music_db;
      let collection = db.collection(which);
      return collection.count();
    },
    queryData: function(which, query, isOne = true) {
        // let client = this._client;
        let db = this._music_db;
        let collection = db.collection(which);
        let result = null;
        // return 的是一个promise
        if (isOne) {
            result = collection.findOne(query);
        } else {
            result = collection.findMany(query);
        }
        return result;
    },
    queryDataSort:function(which,query,sort,offset_y,limit_y){
        let db = this._music_db;
        let collection = db.collection(which);
        let result = null;
        result = collection.find(query).
        sort(sort).skip(offset_y).limit(limit_y).toArray();
        return result;
    },
    updateData: function(which, whereData, newData,callback) {
      let db = this._music_db;
      let collection = db.collection(which);
      collection.update(whereData,{$set:newData},{multi:true},function(err,res){
        if(!err){
          callback&&callback(res);
        }else{
          callback&&callback();
        }
      });
    },
};
if (!global.db_db_controll) {
    global.db_db_controll = db_controll;
}
module.exports = global.db_db_controll;
