const express = require('express');
const serveIndex = require('serve-index');
const path = require('path');

module.exports = (req, res, next) => {
  const { MyAPI } = req.app;
  const { filepath: publicDir, template } = MyAPI.GlobalData.get('resource');

  const serve = express.static(publicDir);
  const index = serveIndex(publicDir, {
    icons: true,
    view: 'details',
    template: template || path.join(__dirname, '../../public/directory.html'),
  })

  serve(req, res, () => {
    index(req, res, next);
  })

  // 日志打印
  MyAPI.Logger(req, res);
}
