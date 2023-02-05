export const searchForHadith = async (
  text = '',
  page = 1,
  query = {},
) => {
  const { books } = query;
  const url = `https://dorar.net/dorar_api.json?skey=${text}&${books}&page=${page}`;
  const res = await fetch(encodeURI(url));
  const data = await res.json();
  const html = he.decode(data.ahadith.result);
  return html;
};
