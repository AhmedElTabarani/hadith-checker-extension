import { getSharhById } from './getSharhById.js';

export const addSharhButtonFunctionality = (sharhBtnClass) => {
  const sharhButtons = document.getElementsByClassName(sharhBtnClass);
  for (const btn of sharhButtons) {
    btn.addEventListener('click', async (e) => {
      const result = await getSharhById(e.target.value);
      console.log(result);
    });
  }
};
