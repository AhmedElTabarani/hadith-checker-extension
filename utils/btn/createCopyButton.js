export const createCopyButton = () => {
  const btn = document.createElement('button');
  btn.classList.add('copy-btn', 'nice-btn');
  btn.setAttribute('type', 'button');
  btn.textContent = 'نسخ الحديث';
  btn.addEventListener('click', (e) => {
    const card = e.target.parentElement;
    const content = card.firstElementChild;
    const oldPadding = content.style.padding;
    content.style.padding = '20px';

    const dorarLink = document.querySelector('.dorar-search-link');
    const url = dorarLink.href;
    const text = `\`\`\`${content.textContent}\`\`\`\nالمصدر: ${url}`;

    btn.disabled = true;
    navigator.clipboard
      .writeText(text)
      .then(
        () => {
          console.log('Copying to clipboard was successful!');
        },
        (err) => {
          console.error('Could not copy text: ', err);
        },
      )
      .finally(() => {
        btn.disabled = false;
        content.style.padding = oldPadding;
      });
  });
  return btn;
};
