const path = require('path');

module.exports = (req, res, next) => {
  const { MyAPI } = req.app;

  res.status(404).sendFile(path.join(__dirname, '../../public/404.html'));

  // 日志打印
  MyAPI.Logger(req, res, '找不到页面');
}