import express from 'express';

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
  app.listen(20003, () => {
    console.log('server is running on port 20003')
  })
  return app;
}
