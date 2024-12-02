/**
 * 日期格式化 
 * @param {string} dateStr
 * @returns {string} 格式: YYYY-MM-DD HH:mm:ss
 */
const formatDate = (dateStr) => {
  if (!dateStr) return dateStr;

  const date = new Date(dateStr);
  // 获取年、月、日、小时、分钟、秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要加1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  // 组合成所需格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 日期时间转最近时间提示
 * @param {string} datetime 日期时间, 格式: YYYY-MM-DD HH:mm:ss
 */
const datetime2latest = (datetime) => {
  if (!datetime) return '';
  datetime = datetime.replace(/-/g, '/');

  let curTimestamp = Math.ceil(new Date().getTime() / 1000); // 当前的时间戳，不含毫秒
  let recTimestamp = Math.ceil(new Date(datetime).getTime() / 1000); // 传入的时间戳，不含毫秒

  const timestamp = curTimestamp - recTimestamp; // 时间戳差值

  // 1小时内
  if (timestamp < 3600) {
    return Math.ceil((timestamp) / 60) + '分钟前';
  }

  // 1天内
  if (timestamp < 3600 * 24) {
    return Math.ceil((timestamp) / 3600) + '小时前';
  }

  const curDate = new Date();
  const curYear = curDate.getFullYear();
  const curMonth = String(curDate.getMonth() + 1).padStart(2, '0');
  const curDay = String(curDate.getDate()).padStart(2, '0');
  curTimestamp = new Date(`${curYear}/${curMonth}/${curDay} 00:00:00`).getTime();

  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  recTimestamp = new Date(`${year}/${month}/${day} 00:00:00`).getTime();

  // 昨天
  if (curTimestamp === recTimestamp + 24 * 3600 * 1000) {
    return `昨天 ${hour}:${minute}`;
  }

  // 前天
  if (curTimestamp === recTimestamp + 24 * 3600 * 1000 * 2) {
    return `前天 ${hour}:${minute}`;
  }

  // 直接返回输入的日期字符串
  return datetime;
}

/**
 * 文件大小格式化
 * @param {number} bytes
 * @return {string} 例如: 10 KB
 */
const formatSize = (bytes) => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 B';
  const index = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return (bytes / Math.pow(1024, index)).toFixed(1) + ' ' + sizes[index];
}



function install() {
  // 获取文件列表中的a标签
  const fileList = Array.from(document.querySelectorAll('ul#files li a'));
  fileList.forEach(el => {
    // 移除 title 属性
    el.removeAttribute('title');

    // 格式化日期
    const dateEl = el.querySelector('span.date');
    const dateStr = formatDate(dateEl.innerHTML);
    dateEl.setAttribute('title', dateStr);
    dateEl.innerHTML = datetime2latest(dateStr);

    // 如果不是目录，格式化文件大小
    if (!el.className.includes('icon-directory')) {
      const sizeEl = el.querySelector('span.size');
      sizeEl.innerHTML = formatSize(sizeEl.innerHTML);
    }
  })
}

install();