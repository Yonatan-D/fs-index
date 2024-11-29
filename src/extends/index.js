const apis = [
  import('./GlobalData.api.js'),
  import('./Logger.api.js'),
  import('./Throw.api.js'),
]

export default async function loadExtends(app) {
  const modules = await Promise.all(apis);
  const api = modules.reduce((acc, module) => {
    const fn = module.default;
    acc[fn.name] = fn(app);
    return acc;
  }, {});
  if (!app.MyAPI) app.MyAPI = {};
  app.MyAPI = Object.assign(app.MyAPI, api);
}
