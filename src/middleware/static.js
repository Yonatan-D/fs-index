const express = require('express');
const serveIndex = require('serve-index');

module.exports = (req, res, next) => {
  const { MyAPI } = req.app;
  const publicDir = MyAPI.GlobalData.get('resource').filepath;

  const serve = express.static(publicDir);
  const index = serveIndex(publicDir, {
    icons: true,
    view: 'details',
  })

  serve(req, res, () => {
    index(req, res, next);
  })

  // 日志打印
  MyAPI.Logger(req, res);
}
