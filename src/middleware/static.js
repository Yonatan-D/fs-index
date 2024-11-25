const express = require('express');
const serveIndex = require('serve-index');
const path = require('path');
const fs = require('fs-extra');
const { execSync, exec } = require('child_process');
const { platform } = require('os');
const { compose } = require('../utils');

/**
 * 获取zip安装命令提示
 * @returns {string}
 */
const getZipInstallCommand = () => {
  if (platform() === 'darwin') {
    return `
      brew install zip
    `;
  } else if (platform() === 'linux') {
    return `
      Ubuntu/Debian: sudo apt-get install zip
      CentOS/RHEL: sudo yum install zip
      Fedora: sudo dnf install zip
      Arch Linux: sudo pacman -S zip
    `;
  } else if (platform() === 'win32') {
    return `
      https://www.7-zip.org/download.html
    `;
  } else {
    return '请手动安装zip命令';
  }
}

/**
 * 使用zip命令压缩目录
 * @param {string} dirPath - 要压缩的目录路径
 * @param {string} outPath - 压缩后的zip文件路径
 * @param {function} done - 压缩完成后的回调函数
 */
const compressDirectoryWithZip = (dirPath, outPath, done) => {
  try {
    execSync('which zip');
    const child =  exec(`cd ${dirPath} && zip -r ${outPath} *`);
    child.on('close', done);
  } catch (error) {
    if (error.message.includes('no zip in')) {
      console.error('未找到zip命令');
      console.log('请使用以下命令安装zip:');
      console.log(getZipInstallCommand());
    } else {
      console.error('命令执行失败', error);
    }
  }
}

module.exports = (req, res, next) => {
  const { MyAPI } = req.app;
  const { filepath: publicDir, temppath, template } = MyAPI.GlobalData.get('resource');

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
          const outPath = `${temppath}/${req.path.substring(1)}-${new Date().getTime()}.zip`;
          compressDirectoryWithZip(filePath, outPath, () => {
            res.sendFile(outPath, (err) => {
              if (err) {
                MyAPI.Throw(err);
              } 
              fs.unlinkSync(outPath); // 删除临时压缩包
            });
          });
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
