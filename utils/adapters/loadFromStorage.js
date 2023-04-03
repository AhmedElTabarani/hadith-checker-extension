export const loadFromStorage = (key) =>
  new Promise((resolve, reject) =>
    chrome.storage.local.get(key, (obj) => {
      resolve(obj[key]);
    }),
  );
