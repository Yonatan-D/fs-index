const dayjs = require('dayjs');

const utils = {
  /**
   * format file size
   * @param {Number} bytes
   * @return {String} such: 10 KB
   */
  formatSize: (bytes) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 B';
    const index = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, index)).toFixed(1) + ' ' + sizes[index];
  },

  /**
   * format file modification time
   * @param {Date} date 
   * @returns {String} such: 2024-10-16 09:30:01
   */
  formatDate: (date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  },

  /**
   * 合并中间件
   * @param {} middlewares 
   * @returns 
   */
  compose: (middlewares) => {
    return (req, res, next) => {
      const dispatch = (i) => {
        const middleware = middlewares[i];
        if (i === middlewares.length) {
          return next();
        }
        return middleware(req, res, () => dispatch(i+1));
      }
      return dispatch(0);
    }
  }
}

module.exports = utils;
