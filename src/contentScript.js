/* global chrome */
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'GET_REVIEWS_DOM') {
    const reviews = Array.from(document.querySelectorAll('.review')).map(el => ({
      author: el.querySelector('.author')?.textContent.trim() || '',
      text: el.querySelector('.content')?.textContent.trim() || ''
    }));
    sendResponse({ reviews });
  }
});
