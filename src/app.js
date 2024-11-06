const express = require('express');
const c = require('kleur');
const middlewares = require('./middleware');
const loadExtends = require('./extends');

const app = express();
loadExtends(app);
const location = app.MyAPI.GlobalData.get('location');
const resource = app.MyAPI.GlobalData.get('resource');

app.use(location.pathname, middlewares);

// 0.0.0.0: 强制节点服务器使用Ipv4侦听
// 如果要兼容 IPv6, 就不能配置 0.0.0.0, 而是检查并移除 ::ffff: 前缀
app.listen(location.port, '0.0.0.0', () => {
  console.log(c.green('[fsIndex] Starting...'));
  console.log(c.gray('Index of'), resource.filepath);
  console.log(c.gray('Listening at'), c.cyan(location.href));
})
