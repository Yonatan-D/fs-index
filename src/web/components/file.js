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

class FileList extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const slot = document.createElement('slot');
    shadow.appendChild(slot);

    const nodes = slot.assignedNodes();
    this.renderFileList(nodes);

    // 添加右键菜单
    const contextMenu = document.createElement('div');
    contextMenu.id = 'contextMenu';
    contextMenu.innerHTML = `
      <style>
        #contextMenu {
          display: none;
          position: absolute;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        #contextMenu ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        #contextMenu li {
          padding: 8px 16px;
          cursor: pointer;
        }
        #contextMenu li:hover {
          background-color: #f0f0f0;
        }
      </style>
      <ul>
        <li>预览</li>
        <li>下载</li>
      </ul>
    `;
    this.contextMenu = contextMenu;
    shadow.appendChild(contextMenu);
    this.menuItems = this.shadowRoot.querySelectorAll('#contextMenu li');
    const that = this;
    this.menuItems.forEach((item) => {
      item.addEventListener('click', this.handleMenuItemClick.bind(that, item.textContent));
    });
  }

  renderFileList(nodes) {
    const list = nodes[0].querySelectorAll('ul#files li');
    Array.from(list).every(li => li.style.width = '100%');
    const links = Array.from(list).map(li => li.querySelector('a'));
    const dates = Array.from(list).map(li => li.querySelector('span.date'));
    const sizes = Array.from(list).map(li => li.querySelector('span.size'));

    links.forEach((link, index) => {
      if (link) {
        link.removeAttribute('title');

        const dateStr = formatDate(dates[index].innerHTML);
        dates[index].setAttribute('title', dateStr);
        dates[index].style.direction = 'ltr';
        dates[index].innerHTML = datetime2latest(dateStr);

        if (!link.className.includes('icon-directory')) {
          sizes[index].style.direction = 'ltr';
          sizes[index].innerHTML = formatSize(sizes[index].innerHTML);
        }
      }
    });

    // const list = nodes[0].querySelectorAll('ul#files li');
    // list.forEach((li) => {
    //   li.style.width = '100%';

    //   const el = li.querySelector('a');
    //   if (el) {
    //     // 移除 title 属性
    //     el.removeAttribute('title');
  
    //     // 格式化日期
    //     const dateEl = el.querySelector('span.date');
    //     const dateStr = formatDate(dateEl.innerHTML);
    //     dateEl.setAttribute('title', dateStr);
    //     dateEl.style.direction = 'ltr';
    //     dateEl.innerHTML = datetime2latest(dateStr);
  
    //     // 如果不是目录，格式化文件大小
    //     if (!el.className.includes('icon-directory')) {
    //       const sizeEl = el.querySelector('span.size');
    //       sizeEl.style.direction = 'ltr';
    //       sizeEl.innerHTML = formatSize(sizeEl.innerHTML);
    //     }
    //   }

    // });
  }

  handleContextMenu(event) {
    const target = event.target;
    if (target.href) {
      event.preventDefault();

      target.setAttribute('data-file', target.href);
      this.contextMenu.style.display = 'block';
      this.contextMenu.style.left = `${event.pageX}px`;
      this.contextMenu.style.top = `${event.pageY}px`;
    } else if (target.parentElement && target.parentElement.href) {
      event.preventDefault();

      target.parentElement.setAttribute('data-file', target.parentElement.href);
      this.contextMenu.style.display = 'block';
      this.contextMenu.style.left = `${event.pageX}px`;
      this.contextMenu.style.top = `${event.pageY}px`;
    } else {
      this.contextMenu.style.display = 'none';
    }
  }

  handleClick(event) {
    if (!event.target.closest('#contextMenu')) {
      this.contextMenu.style.display = 'none';
    }

    // this.contextMenu.style.display = 'none';
  }

  handleMenuItemClick(type) {
    const fileUrl = decodeURIComponent(this.getAttribute('data-file'));
    const fileName = fileUrl.slice(fileUrl.lastIndexOf('/') + 1);

    switch (type) {
      case '预览':
        alert('🚧施工中');
        break;
      case '下载':
        const link = document.createElement('a');
        link.href = `${fileUrl}?download`;
        link.download = fileName;
        link.click();
        break;
      default:
        window.open(fileUrl);
        break;
    }
  }

  connectedCallback() {
    document.addEventListener('contextmenu', this.handleContextMenu.bind(this));
    document.addEventListener('click', this.handleClick.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener('contextmenu', this.handleContextMenu.bind(this));
    document.removeEventListener('click', this.handleClick.bind(this));
  }
  
}

customElements.define('file-list', FileList);
