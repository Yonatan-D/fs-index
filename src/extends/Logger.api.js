import c from 'kleur';
import dayjs from 'dayjs';

export default function Logger(app) {
  return (req, res, message) => {
    // 不记录日志的请求
    const filterUrlList = [
      '/favicon.ico'
    ]

    // token有值才输出显示
    const nullValueHandler = (label, value) => {
      return value 
        ? (' AUTH ' + label + '=' + c.yellow(value))
        : '';
    }

    // 日志内容
    let dateStr = c.gray(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}]`);
    let reqStr = c.green(req.ip)
      + ' -- ' + res.statusCode + ' GET ' 
      + c.yellow(decodeURIComponent(req.url))
      + nullValueHandler('headerToken', req.headers['x-token'])
      + nullValueHandler('cookie', req.headers.cookie)
      + nullValueHandler('urlToken', req.query.token);
    let messageStr = message ? ([401, 404].includes(res.statusCode) ? `reason:${message}` : `fail:${message}`) : '';
    
    if (!filterUrlList.includes(req.url)) {
      // 输出到控制台
      console.log(`${dateStr} ${reqStr} ${messageStr}`);
    }
  }
}