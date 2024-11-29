import minimist from 'minimist';

export default function GlobalData(app) {

  const argv = minimist(process.argv.slice(2));

  const _globalData = {
    config: argv.config || './config/config.toml',
    location: new Location(argv),
    resource: new Resource(argv),
    password: typeof argv.password === 'string' ? argv.password : undefined,
  }

  return new Proxy(_globalData, {
    get(target, key) {
      return target[key] ? target[key] : '';
    }
  })
}

class Location {
  constructor(argv) {
    this.argv = argv;
  }

  get port() {
    return this.argv.port || '8001';
  }

  get protocol() {
    return this.argv.https ? 'https' : 'http';
  }

  get hostname() {
    return this.argv.hostname || 'localhost';
  }

  get pathname() {
    return this.argv.pathname || '/';
  }

  get https() {
    // { key, cert }
    return this.argv.https;
  }

  get href() {
    return `${this.protocol}://${this.hostname}:${this.port}${this.pathname}`;
  }
}

class Resource {
  constructor(argv) {
    this.argv = argv;
  }

  get filepath() {
    return this.argv.filepath || './files';
  }

  get temppath() {
    return this.argv.temppath || '/tmp/fsIndex';
  }

  get template() {
    return this.argv.template;
  }
}
