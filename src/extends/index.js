const requireAll = require('require-all');

module.exports = function loadExtends(app) {
  const api = requireAll({
    dirname: __dirname,
    filter: /(.+)\.api\.js$/,
    resolve: fn => fn(app),
  })
  if (!app.MyAPI) app.MyAPI = {};
  app = Object.assign(app.MyAPI, api);
}