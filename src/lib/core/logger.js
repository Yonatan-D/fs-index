import c from 'kleur';
import dayjs from 'dayjs';

export class Logger {
  #appName;
  #ctx;

  constructor(options) {
    options = {
      appName: 'app',
      ...options
    }
    this.#appName = options.appName;
    this.#ctx = options.ctx;
  }

  #time() {
    return dayjs().format('YYYY-MM-DD HH:mm:ss');
  }

  #url() {
    return this.#ctx ? this.#ctx.req.url : '?';
  }

  log(message) {
    const now = c.gray(this.#time());
    const appName = c.green(this.#appName);
    const url = c.yellow(this.#url());
    message = c.white(message);
    console.log(`${now} ${appName} ${url} ${message}`);
  }

}