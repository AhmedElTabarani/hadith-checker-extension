export const addCopyButtonFunctionality = (copyBtnClass) => {
  const copyButtons = document.getElementsByClassName(copyBtnClass);
  for (const btn of copyButtons) {
    btn.addEventListener('click', (e) => {
      const content = e.target.previousElementSibling;
      const text = `\`\`\`${content.innerText}\`\`\``;
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
  }
};
