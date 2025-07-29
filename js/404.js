// 404.js (used by GitHub Pages for redirect logic)

(function redirect() {
  const baseUrl = 'https://api.github.com/repos/jbenedi/link/issues/';
  const pathParts = window.location.pathname.split('/');
  const encoded = pathParts[2];

  if (!encoded) return;

  try {
    const decoded = parseInt(atob(encoded)) - 10;
    if (isNaN(decoded)) throw new Error();

    const fallback = '/';
    const issueUrl = baseUrl + decoded;

    fetch(issueUrl)
      .then(res => res.json())
      .then(data => {
        const url = data.title;
        try {
          const dest = new URL(url);
          if (dest.hostname !== window.location.hostname) {
            window.location.replace(url);
          } else {
            window.location.replace(fallback);
          }
        } catch {
          window.location.replace(fallback);
        }
      })
      .catch(() => window.location.replace(fallback));
  } catch {
    window.location.replace('/');
  }
})();
