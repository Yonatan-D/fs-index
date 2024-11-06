const path = require('path');

module.exports = (err, req, res, next) => {
  const { MyAPI } = req.app;

  if (err.code == 404) return;

  res.status(err.code).sendFile(path.join(__dirname, '../../public/500.html'));
  // res.status(500).send({ message: '服务异常' });

  // 日志打印
  MyAPI.Logger(req, res, err.message);
}