function saveCookie(cookieName = 'x-token', path = '/') {
  // 将url携带的token参数设置到Cookie
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  if (token) {
    const cookieValue = `${cookieName}=${token};path=${path}`;
    document.cookie = cookieValue;
  }
}

saveCookie();
