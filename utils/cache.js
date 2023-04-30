export const get = (key) =>
  new Promise((resolve, reject) =>
    chrome.storage.session.get(key, (obj) => {
      resolve(obj[key]);
    }),
  );
export const set = (key, value) =>
  new Promise((resolve, reject) =>
    chrome.storage.session.set({ [key]: value }, resolve),
  );

export const clear = () =>
  new Promise((resolve, reject) =>
    chrome.storage.session.clear(resolve),
  );
