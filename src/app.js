const express = require('express');
const c = require('kleur');
const dayjs = require('dayjs');
const fs = require('fs-extra')
const middlewares = require('./middleware');
const loadExtends = require('./extends');

const app = express();
loadExtends(app);
const location = app.MyAPI.GlobalData.get('location');
const resource = app.MyAPI.GlobalData.get('resource');

// 检查文件路径，不存在就创建
const ensureFilePath = (filepath) => {
  console.log(`Ensures Directory: ${filepath}`);
  fs.ensureDirSync(filepath);
}

// 初始化
function init() {
  try {
    console.log(`initializing...\n`);

    ensureFilePath(resource.filepath);

    console.log(`\ninitialization completed.\n`);
  } catch (error) {
    console.log(c.bgRed('[fsIndex] init - 系统启动异常'));
  }
}

init()

app.use(location.pathname, middlewares);

// 0.0.0.0: 强制节点服务器使用Ipv4侦听
// 如果要兼容 IPv6, 就不能配置 0.0.0.0, 而是检查并移除 ::ffff: 前缀
app.listen(location.port, '0.0.0.0', () => {
  let startTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
  console.log(c.green(`[${startTime}] [fsIndex] Starting...`));
  console.log(c.gray('Index of'), resource.filepath);
  console.log(c.gray('Listening at'), c.cyan(location.href));
})
