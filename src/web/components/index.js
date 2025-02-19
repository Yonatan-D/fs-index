export function saveCookie() {
  // 将url携带的token参数设置到Cookie
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  if (token) {
    document.cookie = 'x-token=' + token + ';path=/';
  }
}

saveCookie();
