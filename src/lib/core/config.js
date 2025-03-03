import toml from 'toml';
import fs from 'fs';

export function loadConfig() {
  try {
    const cfgContent = toml.parse(fs.readFileSync('./config/config.toml', 'utf8'));
    // console.log(cfgContent);
  } catch (error) {
    throw `Config: 读取配置文件失败 (${error.message})\n`;
  }
}

export function testConfig() {
  const status = 'successful'; // failed
  console.log(`fs-index: configuration file xxx test is ${status}\n`);
}