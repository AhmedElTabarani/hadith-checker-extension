export const createCopyAsAnImageButton = (reference) => {
  const btn = document.createElement('button');
  btn.classList.add('copy-as-image-btn', 'nice-btn');
  btn.setAttribute('type', 'button');
  btn.textContent = 'حفظ كصورة';
  btn.addEventListener('click', (e) => {
    const card = e.target.parentElement;
    const content = card.firstElementChild;
    const oldPadding = content.style.padding;
    content.style.padding = '20px';

    const textElement = document.createElement('p');
    textElement.textContent = reference;
    textElement.style.fontSize = '14px';
    content.appendChild(textElement);

    btn.disabled = true;
    html2canvas(content).then((canvas) => {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = image;
      link.download = 'hadith.png';
      link.click();
      link.remove();

      canvas.toBlob((blob) => {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard
          .write([item])
          .then(
            () => {
              console.log(
                'Copying image to clipboard was successful!',
              );
            },
            (err) => {
              console.error('Could not copy image: ', err);
            },
          )
          .finally(() => {
            content.style.padding = oldPadding;
            textElement.remove();
            btn.disabled = false;
          });
      });
    });
  });
  return btn;
};
