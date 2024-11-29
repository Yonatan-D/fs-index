import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function errorHandler(err, req, res, next) {
  const { MyAPI } = req.app;

  if (err.code == 404) return;

  const statusCode = (typeof err.code === 'number')
    ? err.code
    : 500

  res.status(statusCode).sendFile(path.join(__dirname, '../../public/500.html'));
  // res.status(500).send({ message: '服务异常' });

  // 日志打印
  MyAPI.Logger(req, res, err.message);
}