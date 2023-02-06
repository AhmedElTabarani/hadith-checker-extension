chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'Check this hadith',
    id: 'check-hadith',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  chrome.storage.session.set({ text: info.selectionText }, async () => {
    await chrome.windows.create({
      url: chrome.runtime.getURL('popup.html'),
      type: 'popup',
    });
  });
});
