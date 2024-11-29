import path from 'node:path';

export default function notFound(req, res, next) {
  const { MyAPI } = req.app;

  res.status(404).sendFile(path.join(MyAPI.GlobalData.appRoot, 'public/404.html'));

  // 日志打印
  MyAPI.Logger(req, res, '找不到页面');
}