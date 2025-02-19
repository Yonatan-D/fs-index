const widgets = [
  '/search.js',
  '/contextMenu.js',
]

export function initWidgets() {
  widgets.forEach(widget => {
    const script = document.createElement('script');
    script.src = widget;
    script.type = 'text/babel';
    document.body.appendChild(script);
  })
}

export function saveCookie() {
  // 将url携带的token参数设置到Cookie
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  if (token) {
    document.cookie = 'x-token=' + token + ';path=/';
  }
}

export function initApis() {
  window.$app = {
    ...window.$app,
    dom: {
      create: (id, component) => {
        const rootNode = document.createElement(id);
        const root = ReactDOM.createRoot(rootNode);
        root.render(React.createElement(component));
        return rootNode;
      },
  
      appendTo: (selector, node) => {
        document.querySelector(selector).appendChild(node);
      }
    }
  }
}

export function installWidgets() {
  const flag = setInterval(() => {
    if ($app.widgets?.length > 0) {
      $app.widgets.forEach(installFn => {
        typeof installFn === 'function' && installFn();
      })
      clearInterval(flag);
    }
  }, 10)
}

initApis();
initWidgets();
saveCookie();
installWidgets();
