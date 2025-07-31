/* global chrome */
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'SCRAPE_PAGE') {
    // 1) Grab all cookies for this URL’s domain
    chrome.cookies.getAll({ url: msg.url }, amazonCookies => {
      // 2) Build a single Cookie header string
      const cookieHeader = amazonCookies
        .map(c => `${c.name}=${c.value}`)
        .join('; ');

      console.log('cookieHeader',cookieHeader)

      // 3) Send fetch with cookies in the body
      // fetch('http://3.82.200.214:3001/scrape', {
      fetch('http://localhost:3001/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url:     msg.url,
          cookies: cookieHeader
        })
      })
      .then(res => res.json())
      .then(data => sendResponse(data))
      .catch(err => sendResponse({ error: err.message }));
    });

    // Return true so we can respond asynchronously
    return true;
  }
});
