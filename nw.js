let Service = require('node-windows').Service;
let svc = new Service({
  name:'music_server',
  description:'音乐后台',
  script:"D:/VSProject/QQMusicBack/bin/www"
});
svc.on('install',()=>{
  svc.start();
});
svc.install();
