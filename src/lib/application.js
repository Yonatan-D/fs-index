import express from 'express';
import c from 'kleur';
import { Settings } from './core/config.js';
import { getDateStr } from './utils.js';

export class Application {
  constructor() {
    this.app = express();

    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }
        return Reflect.get(target.app, prop, receiver);  
      }
    })
  }
  
  Throw(message, code) {
    if (!code) code = 500;
    throw new StandardError(message, code);
  }
}

class StandardError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.tip = message;

    try {
      // 抛出异常的所在行
      this.__line = this.stack.split("\n")[2]
    } catch (error) {

    }

  }
}

export function startApp() {
  const app = new Application();
  const {
    Server: { http_port },
    FileNode,
  } = Settings.globalSettings;

  app.listen(http_port, '0.0.0.0', () => {
    const dateStr = getDateStr();
    const appName = c.cyan('fsIndex');
    const startingInfo = c.green('Starting...');
    console.log(`[${dateStr}] [${appName}] ${startingInfo}`);

    FileNode.forEach(n => {
      if (n?.Options?.autoindex === 'OFF') return;
      console.log(c.bold('Index of'), c.yellow(n.context_path));
      console.log(c.bold('Listening at'), c.cyan(n.href), '\n');
    })
  })
  return app;
}
