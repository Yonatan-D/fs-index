import { extend } from 'extend2';
import fs from 'fs';
import path from 'path';
import toml from 'toml';

const cfgFilePath = path.resolve('./config/config.toml');

let _globalSettings;

function getSettings(cfgContent) {
  const defaultSettings = {
    Server: {
      http_port: 3000,
      https_port: -1,
      template_html: 'web/index.html',
    },
    PreviewConf: {
      enable: 'OFF',
    }
  }
  const settings = extend(true, {}, defaultSettings, cfgContent);
  settings.FileNode.forEach(n => {
    n.href = `http://localhost:${settings.Server.http_port}${n.context_path}`;
  })
  return settings;
}

export function loadConfig() {
  try {
    if (!_globalSettings) {
      const cfgContent = toml.parse(fs.readFileSync(cfgFilePath, 'utf8'));
      _globalSettings = getSettings(cfgContent);
    }
    return new Proxy(_globalSettings, {
      get(target, key) {
        return target[key] ? target[key] : '';
      }
    });
  } catch (error) {
    throw new Error(`Config: 读取配置文件失败 (${error.message})\n`);
  }
}

export function testConfig() {
  let status = 'successful';
  try {
    const settings = loadConfig();
    console.log(JSON.parse(JSON.stringify(settings)));
  } catch (error) {
    status = 'failed';
    console.log(error, '\n');
  }
  console.log(`fs-index: configuration file ${cfgFilePath} test is ${status}\n`);
}
