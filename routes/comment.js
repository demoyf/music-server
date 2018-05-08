var express = require('express');
var router = express.Router();
const _db = require('./../lib/db/mydb');
router.post('/publish_comment',(req,res,next)=>{
  let info = req.body;
  let result = {
    success:false,
    id:'',
    msg:'发布失败'
  }
  _db.getId('comment').then((data)=>{
    info._id = data+1;
    _db.insertData('comment',info,(err,data)=>{
      if(!err){
        result.success = true;
        result._id = data.insertedIds["0"];
      }
      let forum_id = parseInt(info.forum_id);
      _db.queryData('music_forum',{'_id':forum_id}).then((data)=>{
          let count = data.comment_count;
          count++;
          _db.updateData('music_forum',
          {'_id':forum_id},
          {'comment_count':count},(data)=>{
            if(data){
              result.count = count;
            }
            res.end(JSON.stringify(result));
          });
      }).catch(()=>{
        res.end(JSON.stringify(result));
      })
    });
  }).catch(()=>{
    res.end(JSON.stringify(result));
  });
});
router.get('/get_comment/:_id/:offset/:limit',(req,res,next)=>{
  let _id = parseInt(req.params._id);
  let limit = parseInt(req.params.limit);
  let offset = parseInt(req.params.offset);
  _db.queryDataSort('comment',{'forum_id':_id},
  {'publish_time':1},offset,limit).then((data)=>{
    res.end(JSON.stringify(data));
  });
});
router.get('/delete/:id/:forum_id',(req,res,next)=>{
  let _id = parseInt(req.params.id);
  let forum_id = parseInt(req.params.forum_id);
  let result = {
    success:false
  }
  _db.updateData('comment',{'_id':_id},
  {'is_ban':true},(first)=>{
    if(first){
      result.success = true;
      _db.queryData('music_forum',{'_id':forum_id}).then((second)=>{
          let count = second.comment_count;
          count--;
          _db.updateData('music_forum',
          {'_id':forum_id},
          {'comment_count':count},(third)=>{
            if(third){
              result.count = count;
            }
            res.end(JSON.stringify(result));
          });
      }).catch(()=>{
        res.end(JSON.stringify(result));
      })
    }else{
      res.end(JSON.stringify(result));
    }
  });
});
router.get('/my_comment/:user_id',(req,res,next)=>{
  let user_id = req.params.user_id;
  _db.queryDataSort('comment',
  {$or:[{'user_id':user_id},{'my_id':user_id},
  {'replay_to_user_id':user_id}]},{'publish_time':-1},0,100).then((data)=>{
    res.end(JSON.stringify(data));
  });
});
module.exports = router;
