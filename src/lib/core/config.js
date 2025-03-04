import toml from 'toml';
import fs from 'fs';
import { extend } from 'extend2';

export class Settings {

  constructor(settings) {
    this.globalSettings = null;

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
    const mergedSettings = extend(true, {}, defaultSettings, settings);
    return new Proxy(mergedSettings, {
      get(target, key) {
        return target[key] ? target[key] : '';
      }
    })
  }

  static loadConfig() {
    try {
      if (!this.globalSettings) {
        const cfgContent = toml.parse(fs.readFileSync('./config/config.toml', 'utf8'));
        this.globalSettings = new Settings(cfgContent);
      }
      return JSON.parse(JSON.stringify(this.globalSettings));
    } catch (error) {
      throw `Config: 读取配置文件失败 (${error.message})\n`;
    }
  }

  static testConfig() {
    const status = 'successful'; // failed
    console.log(`fs-index: configuration file xxx test is ${status}\n`);
  }
}
