import express from 'express';
import compression from 'compression';
import c from 'kleur';
import dayjs from 'dayjs';
import fs from 'fs-extra';
import toml from 'toml';
import loadModules from './app/middleware/index.js';
import loadExtends from './app/extend/index.js';

async function createServer() {
  const app = express();

  // 检查文件路径，不存在就创建
  const ensureFilePath = (filepath) => {
    console.log(`Ensures Directory: ${filepath}`);
    fs.ensureDirSync(filepath);
  }

  // 加载配置
  const loadConfig = (cfgFile) => {
    try {
      const cfgContent = toml.parse(fs.readFileSync(cfgFile, 'utf8'));
      // console.log(cfgContent);
      
      console.log(`Config: ${cfgFile}`);
    } catch (error) {
      console.log(`Config: 读取配置文件失败 (${error.message})`);
    }
  }

  // 初始化
  await loadExtends(app);
  app.use(compression());
  await loadModules(app);

  const { MyAPI } = app;
  const {
    config,
    resource,
  } = MyAPI.GlobalData;

  try {
    console.log(`initializing...\n`);

    loadConfig(config);
    ensureFilePath(resource.filepath);
    ensureFilePath(resource.temppath);

    console.log(`\ninitialization completed.\n`);
  } catch (error) {
    console.log(c.bgRed('[fsIndex] init - 系统启动异常'));
    MyAPI.Throw(error);
  }

  return { app };
}

createServer().then(({ app }) => {
  const { MyAPI } = app;
  const { location, resource } = MyAPI.GlobalData;

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
