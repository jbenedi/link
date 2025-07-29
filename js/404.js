(function redirect() {
  const baseUrl = 'https://api.github.com/repos/jbenedi/link/issues/';
  const pathParts = window.location.pathname.split('/');
  const encoded = pathParts[2];

  const fallback = 'https://jbenedict.com/link';

  if (!encoded) {
    window.location.replace(fallback);
    return;
  }

  try {
    const decoded = parseInt(atob(encoded)) - 10;
    if (isNaN(decoded)) throw new Error();

    const issueUrl = baseUrl + decoded;

    fetch(issueUrl)
      .then(res => res.json())
      .then(data => {
        const url = data.title;
        try {
          const dest = new URL(url);
          if (dest.hostname !== window.location.hostname) {
            // Try loading the target URL to verify it's reachable
            fetch(dest.href, { method: 'HEAD', mode: 'no-cors' })
              .then(() => window.location.replace(dest.href))
              .catch(() => window.location.replace(fallback));
          } else {
            window.location.replace(fallback);
          }
        } catch {
          window.location.replace(fallback);
        }
      })
      .catch(() => window.location.replace(fallback));
  } catch {
    window.location.replace(fallback);
  }
})();
