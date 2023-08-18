export const createCopyAsAnImageButton = () => {
  const btn = document.createElement('button');
  btn.classList.add('copy-as-image-btn', 'nice-btn');
  btn.setAttribute('type', 'button');
  btn.textContent = 'حفظ كصورة';
  btn.addEventListener('click', (e) => {
    const card = e.target.parentElement;
    const content = card.firstElementChild;
    content.style.padding = '20px'
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
        navigator.clipboard.write([item]).then(
          () => {
            btn.disabled = false;
            console.log('Copying image to clipboard was successful!');
          },
          (err) => {
            console.error('Could not copy image: ', err);
          },
        );
      });
    });
  });
  return btn;
};
