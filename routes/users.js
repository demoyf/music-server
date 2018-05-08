var express = require('express');
var router = express.Router();
const _db = require('./../lib/db/mydb');
/* GET users listing. */
router.post('/check',(req,res,next)=>{
   let body = req.body;
   let usrename = req.body.username;
   _db.queryData('user',{'_id':usrename}).then((data)=>{
     let result = {
       success:false,
       msg:'',
       info:undefined
     }
     if(data){
       if(data.password==body.password){
         result.success = true;
         result.info = data;
         if(data.is_ban){
           result.success = false;
           result.msg = "账号已被禁止登录";
         }
       }else{
         result.success = false;
         result.msg = '密码错误';
       }
     }else{
       result.success = false;
       result.msg = '账号不存在';
     }
      res.end(JSON.stringify(result));
   });
   // res.end(JSON.stringify({success:true}));
});
router.post('/reg',(req,res,next)=>{
  let body = req.body;
  let username = body.username;
  let password = body.password;
  let picture = Math.ceil(Math.random()*15+1);
  let obj = {
    _id:username,
    username:username,
    nickname:'用户:'+username.substr(0,5),
    password:password,
    personal_tag:'稍微写点自己的爱好？',
    is_manager:true,
    is_ban:false,
    picture:picture,
    report_count:0
  }
  _db.insertData('user',obj,(err,data)=>{
    let result = {
      success:false,
      msg:'',
      data:undefined
    }
    if(err||!data){
      result.msg = '该账号已被注册';
    }else{
      result.success = true;
      result.data = data.ops[0];
    }
    res.end(JSON.stringify(result));
  });
});
router.get('/info/:_id',(req,res,next)=>{
  let my_id = req.params._id;
  _db.queryData('user',{'_id':my_id}).then((data)=>{
    data.picture = "http://106.14.13.178/icon/"+data.picture+".jpg";
    res.end(JSON.stringify(data));
  });
});
router.get('/ban/:_id/:is_ban',(req,res,next)=>{
  let _id = req.params._id;
  let is_ban = req.params.is_ban=='true'?true:false;
  let result = {
    success:false
  }
  _db.updateData('user',{'_id':_id},{'is_ban':is_ban},(data)=>{
    if(data){
      _db.updateData('music_forum',{'user_id':_id},{'is_ban':is_ban},(temp)=>{
        if(temp){
          result.success = true;
        }
        res.end(JSON.stringify(result));
      });
    }else{
      res.end(JSON.stringify(result));
    }
  });
});
router.get('/ban_forum/:_id/:is_ban',(req,res,next)=>{
  let _id = parseInt(req.params._id);
  let is_ban = req.params.is_ban=='true'?true:false;
  let result = {
    success:false
  }
  _db.updateData('music_forum',{'_id':_id},{'is_ban':is_ban},(data)=>{
    if(data){
      result.success = true;
    }
    res.end(JSON.stringify(result));
  });
});
router.get('/report/:user_name',(req,res,next)=>{
  let user_name = req.params.user_name;
  let result ={
    success:false,
    msg:'举报失败'
  };
  _db.queryData('user',{'_id':user_name}).then((data)=>{
    if(data){
      let report = data.report_count+1;
      _db.updateData('user',{'_id':user_name},{'report_count':report},(data)=>{
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
router.get('/update_img/:user_id/:picture_id',(req,res,next)=>{
  let _id = req.params.user_id;
  let picture_id = parseInt(req.params.picture_id);
  let result = {
    success:false
  }
  _db.updateData('user',{'_id':_id},{'picture':picture_id},(data)=>{
    if(data){
      result.success = true;
    }
    res.end(JSON.stringify(result));
  });
});
router.post('/update_info/:user_id',(req,res,next)=>{
  let _id = req.params.user_id;
  let info = req.body;
  let result = {
    success:false
  }
  _db.updateData('user',{'_id':_id},info,(data)=>{
    if(data){
      result.success = true;
    }
    res.end(JSON.stringify(result));
  });
});
router.post('/add_collect/',(req,res,next)=>{
  let body = req.body;
  let type = body.type;
  let check_obj = {
  }
  // song
  if(type==1){
    check_obj = {
      'user_id':body.user_id,
      'song_id':body.song_id
    }
  }else if(type==2){
    // artist
    check_obj = {
      'user_id':body.user_id,
      'ting_uid':body.ting_uid,
      'artist_id':body.artist_id
    }
  }else{
    check_obj = {
      'user_id':body.user_id,
      'album_id':body.album_id,
    }
  }
  let result = {
    success:false,
    msg:'已经收藏过了'
  }
  _db.queryData('music_collection',check_obj).then((data)=>{
    if(!data||data.length==0){
      _db.getId('music_collection').then((second)=>{
        body._id = second+1;
        _db.insertData('music_collection',body,(err,third)=>{
          if(!err){
            result.success = true;
            res.end(JSON.stringify(result));
          }
        });
      });
    }else{
      res.end(JSON.stringify(result));
    }
  }).catch(()=>{
    result.msg = '收藏失败';
    res.end(JSON.stringify(result));
  });
});
router.get('/collect/:user_id',(req,res,next)=>{
  let id = req.params.user_id;
  _db.queryDataSort('music_collection',{'user_id':id},{},0,100).then((data)=>{
      res.end(JSON.stringify(data));
  });
});
router.get('/has_new/:user_id',(req,res,next)=>{
  let user_id = req.params.user_id;
  let result = {
    has_new:false
  }
  _db.queryDataSort('comment',{$or:[{'user_id':user_id,'my_id':{$ne:user_id},'type':1,'is_new':true},
  {'replay_to_user_id':user_id,'type':2,'is_new':true}]},{},0,10).then((data)=>{
    if(data&&data.length>0){
      result.has_new = true;
    }
    res.end(JSON.stringify(result));
  });
});
router.get('/update_new/:user_id',(req,res,next)=>{
  let user_id = req.params.user_id;
  let result = {
    has_new:false
  }
  _db.updateData('comment',{$or:[{'user_id':user_id,'my_id':{$ne:user_id},'type':1,'is_new':true},
  {'replay_to_user_id':user_id,'type':2,'is_new':true}]},{'is_new':false},(data)=>{
    if(data){
      result.has_new = true;
    }
    res.end(JSON.stringify(result));
  });
});
module.exports = router;
