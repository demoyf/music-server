var express = require('express');
var router = express.Router();
const _db = require('./../lib/db/mydb');
router.post('/publish',(req,res,next)=>{
  let info = req.body;
  let result = {
    success:false,
    id:'',
    msg:'发布失败'
  }
  _db.getId('music_forum').then((data)=>{
    info.is_ban = false;
    info._id = data+1;
    _db.insertData('music_forum',info,(err,data)=>{
      if(!err){
        result.success = true;
        result.id = data.insertedIds["0"];
      }
      res.end(JSON.stringify(result));
    });
  }).catch(()=>{
    res.end(JSON.stringify(result));
  });
});
router.get('/time_forum/:offset/:limit',(req,res,next)=>{
  let limit = parseInt(req.params.limit||10);
  let offset = parseInt(req.params.offset||0);
  _db.queryDataSort('music_forum',{},{'publish_time':-1},offset,limit).then((data)=>{
      res.end(JSON.stringify(data));
  });
});
router.get('/hot_forum/:offset/:limit',(req,res,next)=>{
  let limit = parseInt(req.params.limit||10);
  let offset = parseInt(req.params.offset||0);
  _db.queryDataSort('music_forum',{},
  {'comment_count':-1},offset,limit).then((data)=>{
      res.end(JSON.stringify(data));
  });
});
router.get('/type_time/:type/:offset/:limit',(req,res,next)=>{
  let limit = parseInt(req.params.limit||10);
  let offset = parseInt(req.params.offset||0);
  let type = parseInt(req.params.type||1);
  _db.queryDataSort('music_forum',{'type':type},
  {'publish_time':-1},offset,limit).then((data)=>{
      res.end(JSON.stringify(data));
  });
});
router.get('/type_comment/:type/:offset/:limit',(req,res,next)=>{
  let limit = parseInt(req.params.limit||10);
  let offset = parseInt(req.params.offset||0);
  let type = parseInt(req.params.type||1);
  _db.queryDataSort('music_forum',{'type':type},
  {'comment_count':-1},offset,limit).then((data)=>{
      res.end(JSON.stringify(data));
  });
});
router.get('/search/:query',(req,res,next)=>{
  let query = decodeURI(req.params.query);
  let temp = new RegExp(""+ query+"","ig");
  _db.queryDataSort('music_forum',{'title':temp},
  {'comment_count':-1},0,100).then((data)=>{
      res.end(JSON.stringify(data));
  });
})
module.exports = router;
