const express = require('express');
const serveIndex = require('serve-index');
const path = require('path');
const fs = require('fs-extra');
const { compose } = require('../utils');

module.exports = (req, res, next) => {
  const { MyAPI } = req.app;
  const { filepath: publicDir, template } = MyAPI.GlobalData.get('resource');

  const serve = express.static(publicDir);
  const index = serveIndex(publicDir, {
    icons: true,
    view: 'details',
    template: template || path.join(__dirname, '../../public/directory.html'),
  })
  const downloader = (req, res, next) => {
    // 请求参数包含download时，指示浏览器下载文件而不是直接显示它
    if (req.query.hasOwnProperty('download')) {
      const filePath = path.join(publicDir, req.path);
      const exists = fs.pathExistsSync(filePath);
      if (exists) {
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          // 如果是文件直接下载
          res.download(filePath, (err) => {
            if (err) {
              MyAPI.Throw(err);
            }     
          });
        } else if (stats.isDirectory()) {
          // 如果是目录就压缩后下载
          res.send('压缩中...')
          // 1.压缩包
          // 2.服务的推送
        }
      } else {
        console.log(`${filePath} 不存在`);
        next();
      }
    } else {
      next();
    }
  }

  const fn = compose([downloader, serve, index]);
  fn(req, res, next);
  // 上面写法等同于以下
  // downloader(req, res, () => {
  //   serve(req, res, () => {
  //     index(req, res, next);
  //   })
  // })

  // 日志打印
  MyAPI.Logger(req, res);
}
