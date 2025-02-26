/**
 * 合并中间件
 * @param {} middlewares 
 * @returns 
 */
export function compose(middlewares) {
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
