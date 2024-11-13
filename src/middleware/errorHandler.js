const path = require('path');

module.exports = (err, req, res, next) => {
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