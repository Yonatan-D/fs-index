const middleware = [
  import('./auth.js'),
  import('./static.js'),
  import('./notFound.js'),
  import('./errorHandler.js'), // 错误处理放最后
]

export default async function loadModules(app) {
  const middlewares = (await Promise.all(middleware))
    .map(i => i.default);
  app.use(app.MyAPI.GlobalData.location.pathname, middlewares);
}