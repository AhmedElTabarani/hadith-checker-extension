export const createCopyButton = () => {
  const btn = document.createElement('button');
  btn.classList.add('copy-btn', 'nice-btn');
  btn.setAttribute('type', 'button');
  btn.textContent = 'نسخ الحديث';
  btn.addEventListener('click', (e) => {
    const content = e.target.previousElementSibling;
    const text = `\`\`\`${content.textContent}\`\`\``;
    btn.disabled = true;
    navigator.clipboard.writeText(text).then(
      () => {
        btn.disabled = false;
        console.log('Copying to clipboard was successful!');
      },
      (err) => {
        console.error('Could not copy text: ', err);
      },
    );
  });
  return btn;
};
