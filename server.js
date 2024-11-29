import express from 'express';
import c from 'kleur';
import dayjs from 'dayjs';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import toml from 'toml';
import loadModules from './src/middleware/index.js';
import loadExtends from './src/extends/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();


// 检查文件路径，不存在就创建
const ensureFilePath = (filepath) => {
  console.log(`Ensures Directory: ${filepath}`);
  fs.ensureDirSync(filepath);
}

// 加载配置
const loadConfig = (config) => {
  try {
    const cfgFile = path.join(__dirname, config);
    const cfgContent = toml.parse(fs.readFileSync(cfgFile, 'utf8'));
    // console.log(cfgContent);
    
    console.log(`Config: ${cfgFile}`);
  } catch (error) {
    console.log(`Config: 读取配置文件失败 (${error.message})`);
  }
}

// 初始化
async function init() {
  await loadExtends(app);

  const {
    config,
    resource,
  } = app.MyAPI.GlobalData;

  try {
    console.log(`initializing...\n`);

    loadConfig(config);
    ensureFilePath(resource.filepath);
    ensureFilePath(resource.temppath);

    console.log(`\ninitialization completed.\n`);
  } catch (error) {
    console.log(c.bgRed('[fsIndex] init - 系统启动异常'));
    app.MyAPI.Throw(error);
  }
}

init().then(() => {
  const { location, resource } = app.MyAPI.GlobalData;
  
  loadModules(app);
  
  // 0.0.0.0: 强制节点服务器使用Ipv4侦听
  // 如果要兼容 IPv6, 就不能配置 0.0.0.0, 而是检查并移除 ::ffff: 前缀
  app.listen(location.port, '0.0.0.0', () => {
    let startTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    console.log(c.gray(`[${startTime}]`), c.cyan('[fsIndex]'), c.green('Starting...\n'));
    console.log(c.bold('Index of'), c.yellow(resource.filepath));
    console.log(c.bold('Listening at'), c.cyan(location.href));
    console.log();
  })
})