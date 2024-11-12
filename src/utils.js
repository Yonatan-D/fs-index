const dayjs = require('dayjs');

const utils = {
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
