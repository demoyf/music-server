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
  let obj = {
    _id:username,
    username:username,
    nickname:'用户:'+username.substr(0,5),
    password:password,
    personal_tag:'稍微写点自己的爱好？',
    is_manager:true,
    is_ban:false,
    picture:1
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

module.exports = router;
