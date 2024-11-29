import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function notFound(req, res, next) {
  const { MyAPI } = req.app;

  res.status(404).sendFile(path.join(__dirname, '../../public/404.html'));

  // 日志打印
  MyAPI.Logger(req, res, '找不到页面');
}