var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var billboard = require('./routes/billboard');
var artist = require('./routes/artist');
var song_routes = require('./routes/song');
var search_routes = require('./routes/search');
var album_routes = require('./routes/album');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// all 设置一些共用的属性，例如返回的数据类型，跨域的一些头
app.all('*', function(req, res, next) {
	// 返回结果为json
    res.type("text/json");
    // 允许访问的域名
    res.header("Access-Control-Allow-Origin", "*");
    //  允许发送凭据
    res.header("Access-Control-Allow-Credentials",true);
    // 允许接收的请求头
    res.header("Access-dControl-Allow-Headers", "Content-Type,Content-Length,Authorization,X-Powered-By,X-Requested-With");
    // 请求方法
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", '3.2.1');
    // 内容类型
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.use('/', index);
app.use('/users', users);
app.use('/billboard', billboard);
app.use('/artist', artist);
app.use('/song', song_routes);
app.use('/search', search_routes);
app.use('/album', album_routes);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;