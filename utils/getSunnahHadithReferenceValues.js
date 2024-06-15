export default (table) => {
  const allTableData = table.querySelectorAll('td');
  const result = {};

  for (let i = 0; i < allTableData.length; i += 2) {
    const key = allTableData[i].textContent.trim();
    const value = allTableData[i + 1];

    if (key === 'Reference') {
      result['hadithNumberInCollection'] = value.children[0]
        .getAttribute('href')
        .split(':')
        .at(-1);
    } else if (
      key === 'In-book reference' ||
      key === 'Sunnah.com reference'
    ) {
      result['hadithNumberInBook'] = value.textContent
        .trim()
        .split(' ')
        .at(-1);
    }
  }

  return result;
};
