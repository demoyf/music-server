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
  info.report_count = 0;
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
router.get('/forum_content/:id',(req,res,next)=>{
  let id = parseInt(req.params.id);
  _db.queryData('music_forum',{'_id':id}).then((data)=>{
    res.end(JSON.stringify(data));
  });
});
router.get('/time_forum/:sort/:offset/:limit',(req,res,next)=>{
  let limit = parseInt(req.params.limit||10);
  let offset = parseInt(req.params.offset||0);
  let sort = req.params.sort;
  let sort_obj = {'publish_time':-1};
  if(sort==1){
    sort_obj ={
      'publish_time':1
    }
  }
  _db.queryDataSort('music_forum',{'is_ban':false},sort_obj,offset,limit).then((data)=>{
      res.end(JSON.stringify(data));
  });
});
router.get('/hot_forum/:sort/:offset/:limit',(req,res,next)=>{
  let limit = parseInt(req.params.limit||10);
  let offset = parseInt(req.params.offset||0);
  let sort = req.params.sort;
  let sort_obj = {'comment_count':-1};
  if(sort==1){
    sort_obj ={
      'comment_count':1
    }
  }
  _db.queryDataSort('music_forum',{'is_ban':false},
  sort_obj,offset,limit).then((data)=>{
      res.end(JSON.stringify(data));
  });
});
router.get('/type_time/:type/:sort/:offset/:limit',(req,res,next)=>{
  let limit = parseInt(req.params.limit||10);
  let offset = parseInt(req.params.offset||0);
  let type = parseInt(req.params.type||1);
  let sort = req.params.sort;
  let sort_obj = {'publish_time':-1};
  if(sort==1){
    sort_obj ={
      'publish_time':1
    }
  }
  _db.queryDataSort('music_forum',{'type':type,'is_ban':false},
  sort_obj,offset,limit).then((data)=>{
      res.end(JSON.stringify(data));
  });
});
router.get('/type_comment/:type/:sort/:offset/:limit',(req,res,next)=>{
  let limit = parseInt(req.params.limit||10);
  let offset = parseInt(req.params.offset||0);
  let type = parseInt(req.params.type||1);
  let sort = req.params.sort;
  let sort_obj = {'comment_count':-1};
  if(sort==1){
    sort_obj ={
      'comment_count':1
    }
  }
  _db.queryDataSort('music_forum',{'type':type,'is_ban':false},
  sort_obj,offset,limit).then((data)=>{
      res.end(JSON.stringify(data));
  });
});
router.get('/search/:query/:sort/:type/:offset/:limit',(req,res,next)=>{
  let limit = parseInt(req.params.limit||10);
  let offset = parseInt(req.params.offset||0);
  let query = decodeURI(req.params.query);
  let temp = new RegExp(""+ query+"","ig");
  let sort = req.params.sort;
  let type = parseInt(req.params.type);
  let sort_obj = {'comment_count':1};
  if(sort==2){
    sort_obj = {'comment_count':-1};
  }else if(sort==3){
    sort_obj = {'publish_time':1};
  }else if(sort==4){
    sort_obj = {'publish_time':-1};
  }
  let search_obj={'title':temp};
  if(type!=0){
    search_obj = {'title':temp,'type':type};
  }
  _db.queryDataSort('music_forum',search_obj,
    sort_obj,offset,limit).then((data)=>{
      res.end(JSON.stringify(data));
  });
})
router.get('/report/:id',(req,res,next)=>{
  let user_name = parseInt(req.params.id);
  let result ={
    success:false,
    msg:'举报失败'
  };
  _db.queryData('music_forum',{'_id':user_name}).then((data)=>{
    if(data){
      let report = data.report_count+1;
      _db.updateData('music_forum',{'_id':user_name},{'report_count':report},(data)=>{
        if(data){
          result.success = true;
        }
        res.end(JSON.stringify(result));
      });
    }else{
      res.end(JSON.stringify(result));
    }
  })
});
router.get('/my_forum/:user_id',(req,res,next)=>{
  let user_id = req.params.user_id;
  _db.queryDataSort('music_forum',{'user_id':user_id},
    {'publish_time':1},0,100).then((data)=>{
      res.end(JSON.stringify(data));
  });
});
router.get('/report_forum',(req,res,next)=>{
  _db.queryDataSort('music_forum',{},
    {'report_count':-1},0,100).then((data)=>{
      res.end(JSON.stringify(data));
  });
});
module.exports = router;
