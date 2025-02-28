import { loadConfig } from './lib/core/config.js';
import { execute } from './lib/core/command.js';
import { startApp } from './lib/application.js';

export function main() {
  // 加载配置
  loadConfig();

  // 执行命令模式
  const isCommandMode = execute();
  
  // 如果不是命令模式，则启动服务
  if (!isCommandMode) {
    startApp();
  }
}
