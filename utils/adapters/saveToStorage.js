export const saveToStorage = (key, value) =>
  new Promise((resolve, reject) =>
    chrome.storage.local.set({[key] : value}, resolve),
  );
