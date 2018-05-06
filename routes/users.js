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
module.exports = router;
