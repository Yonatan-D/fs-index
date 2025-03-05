import c from 'kleur';
import { startApp } from './lib/application.js';
import { Settings } from './lib/core/config.js';

function showHelp() {
  // console.log(c.green(c.bold(name)) + c.dim(` ${description} v${version}\n`))
  console.log(c.green(c.bold('fs-index')) + c.dim(` index of file list v1.0.0`))
  console.log(c.green(c.bold('Usage:')) + c.dim(` fs-index [options]\n`));
  console.log(c.green(c.bold('Options:')));
  console.log(c.green(c.bold('  -v')) + c.dim(` show version`));
  console.log(c.green(c.bold('  -t')) + c.dim(` test configuration file\n\n`));
}

function showVersion() {
  console.log(c.green(c.bold('fs-index version:')) + c.dim(` v1.0.0\n`))
}

export function main() {
  try {
    // 加载配置
    Settings.loadConfig();

    // 命令模式
    for (const args of process.argv.slice(2)) {
      switch (args) {
        case '-v':
          showVersion();
          return;
        case '-t':
          Settings.testConfig();
          return;
        default:
          showHelp();
          return;
      }
    }

    // 启动服务
    startApp();
  } catch (error) {
    console.log(c.red(error));
  }
}
