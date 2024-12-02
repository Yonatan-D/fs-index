function tpl() {
  const html = `
    <ul>
      <li>预览</li>
      <li>下载</li>
    </ul>
  `
  const contextMenu = document.createElement('div');
  contextMenu.id = 'contextMenu';
  contextMenu.innerHTML = html;

  let selectFile = null;

  // 隐藏右键菜单
  function hideContextMenu() {
    contextMenu.style.display = 'none';
  }

  // 显示右键菜单
  function showContextMenu(event) {
    event.preventDefault(); // 阻止默认的右键菜单
    try {
      hideContextMenu();
      const target = event.target;
      if (target.parentElement && target.parentElement.href) {
        selectFile = target.parentElement.href;
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.top = `${event.pageY}px`;
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleContextMenu(type, url) {
    console.log(type, url);
    switch (type) {
      case '预览':
        alert('🚧施工中')
        break;
      case '下载':
        window.location.href = url + '?download';
        break;
      default:
        window.open(url);
        break;
    }
  }


  // 监听右键菜单内部点击事件，点击菜单项时隐藏右键菜单
  contextMenu.onclick = (event) => {
    event.stopPropagation(); // 阻止事件冒泡
    handleContextMenu(event.target.innerHTML, selectFile);
    hideContextMenu();
  };
  // 监听右键点击事件
  document.oncontextmenu = showContextMenu;
  // 监听点击事件，点击页面其他地方时隐藏右键菜单
  document.onclick = hideContextMenu;


  const body = document.querySelector('body');
  body.appendChild(contextMenu); 
}

function install() {
  tpl();
}

install();