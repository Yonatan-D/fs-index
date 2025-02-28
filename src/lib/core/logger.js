import c from 'kleur';
import dayjs from 'dayjs';

export class Logger {
  #ctx;

  constructor(options) {
    options = {
      ...options
    }
    this.#ctx = options.ctx;
  }

  #getCurrentTime() {
    return dayjs().format('YYYY-MM-DD HH:mm:ss');
  }

  #getReqInfo() {
    return this.#ctx ? this.#ctx.req.url : '?';
  }

  log(message) {
    const dateStr = c.gray(this.#getCurrentTime());
    const reqInfo = c.yellow(this.#getReqInfo());
    message = c.white(message);
    console.log(`[${dateStr}] ${reqInfo} ${message}`);
  }

}