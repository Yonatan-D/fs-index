'use strict';

function ContextMenu() {
  const [showMenu, setShowMenu] = React.useState(false);
  const [selectFile, setSelectFile] = React.useState(null);
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });
  const menu = ['预览', '下载'];

  React.useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
      const target = event.target;
      if (target.href) {
        setSelectFile(target.href);
        setMenuPosition({ x: event.pageX, y: event.pageY });
        setShowMenu(true);
      } else if (target.parentElement && target.parentElement.href) {
        setSelectFile(target.parentElement.href);
        setMenuPosition({ x: event.pageX, y: event.pageY });
        setShowMenu(true);
      } else {
        setShowMenu(false);
      }
    };

    const handleClick = () => {
      setShowMenu(false);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleMenuItemClick = (type) => {
    console.log(type, selectFile);

    const fileUrl = decodeURIComponent(selectFile);
    const fileName = fileUrl.slice(fileUrl.lastIndexOf('/') + 1);

    switch (type) {
      case '预览':
        alert('🚧施工中');
        break;
      case '下载':
        const link = document.createElement('a');
        link.href = `${selectFile}?download`;
        link.download = fileName;
        link.click();
        break;
      default:
        window.open(selectFile);
        break;
    }
  };

  return (
    <div
      id="contextMenu"
      style={{
        display: showMenu ? 'block' : 'none',
        left: `${menuPosition.x}px`,
        top: `${menuPosition.y}px`,
      }}
      className="bg-white border rounded shadow-lg position-absolute"
    >
      <ul className="list-unstyled p-0 m-0">
        {menu.map((item) => (
          <li
            key={item}
            className="pt-3 pr-4 pb-3 pl-4 cursor-pointer hover:bg-gray-100"
            onClick={() => handleMenuItemClick(item)}
          >{item}</li>
        ))}
      </ul>
    </div>
  );
}

function install() {
  console.log('✔ ContextMenu');
  const el = window.$app.dom.create('div', ContextMenu);
  window.$app.dom.appendTo('#app', el);
}

window.$app = window.$app || {};
$app.widgets = [install, ...($app.widgets || [])];
