import path from 'node:path';

export default function auth(req, res, next) {
  const { MyAPI } = req.app;
  const { password } = MyAPI.GlobalData;

  if (
    ['localhost', '127.0.0.1'].includes(req.hostname) // 本地允许访问
    || !password // 未开启密码
    || (password && req.headers['x-token'] === password)  // 请求头携带 x-token
    || (password && req.headers.cookie?.includes('x-token='+password)) // 浏览器携带 cookie
    || (password && req.query?.token === password) // url携带 token
  ) {
    return next();
  }

  // 拒绝访问
  res.status(401).sendFile(path.join(MyAPI.GlobalData.appRoot, 'public/401.html'));

  // 日志打印
  MyAPI.Logger(req, res, '无权限访问');
}