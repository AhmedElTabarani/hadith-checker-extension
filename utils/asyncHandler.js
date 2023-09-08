import { setLoader, hideLoader } from './loader.js';
import { showMessage } from './showMessage.js';

export default (fn) =>
  async (...arg) => {
    try {
      showMessage('');
      setLoader();
      await fn(...arg);
      hideLoader();
    } catch (err) {
      hideLoader();
      err.message ||= `
        <span>حدث خطأ ما</span>
        <br/>
        <span>الرجاء كتابة وصف للمشكلة</span>
        <br/>
        <span>من خلال الرابط التالي</span>
        <br/>
        <span>https://github.com/AhmedElTabarani/hadith-checker-extension/issues</span>
      `;
      showMessage(
        `
          <span>${err.message}</span>
          <br/>
      `,
      );
    }
  };
