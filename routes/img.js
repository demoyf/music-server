var express = require('express');
var router = express.Router();
var formidable = require('formidable');
const path = require('path');
const fs = require('fs');
/* GET users listing. */
router.post('/upload', function(req, res, next) {
  var dirname = path.join(__dirname, './../../Apache/htdocs/image');
  var form = new formidable.IncomingForm();
  form.encoding = "utf-8";
  form.uploadDir = dirname;
  form.maxFontSize = 2 * 1024 * 1024;
  form.parse(req, function (err, fields, files) {
      if (err)return;
      var fileName = new Date().getTime() + ".png";
      var newPath = "http://106.14.13.178/image"+ "/" + fileName;
      fs.rename(files.img.path, newPath, function () {
          res.type("text/json");
          res.end(JSON.stringify({error:0,data:[newPath]}));
      });
  });
});
module.exports = router;
