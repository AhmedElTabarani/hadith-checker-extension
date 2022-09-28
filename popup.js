import {
  getAllHadith,
  getAllHadithInfo,
} from './utils/extractHadithInfo.js';

const cards = document.getElementsByClassName('cards')[0];
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const pageCounter = document.getElementById('page-counter');

let currPage = 1;
let currText;

const searchForHadithByText = async (text, page = 1) => {
  const url = `https://dorar.net/dorar_api.json?skey=${text}&page=${page}`;
  const data = await convertToJSON(url);
  return data;
};

const convertToJSON = async (url) => {
  try {
    const res = await fetch(encodeURI(url));
    const data = await res.json();
    const html = he.decode(data.ahadith.result);
    const allHadith = getAllHadith(html);
    const allHadithInfo = getAllHadithInfo(html);

    const result = allHadith.map((hadith, index) => {
      return {
        ...hadith,
        ...allHadithInfo[index],
      };
    });
    return result;
  } catch (err) {
    console.error(err);
  }
};

const updateContent = (allHadith) => {
  const allCardsDiv = allHadith.map((_hadith) => {
    const { hadith, el_rawi, el_mohdith, source, number_or_page, grade } =
      _hadith;

    return `<div class="card">
             <p class="hadith-text">${hadith}</p>
             <div class="hadith-info">
                <p class="hadith-rawi"><span>الراوي:</span> ${el_rawi}</p>
                <p class="hadith-mohdith"><span>المتحدث:</span> ${el_mohdith}</p>
                <p class="hadith-source"><span>المصدر:</span> ${source}</p>
                <p class="hadith-number"><span>رقم الحديث أو الصفحة:</span> ${number_or_page}</p>
                <p class="hadith-grade"><span>صحة الحديث:</span> ${grade}</p>
             </div>
        </div>`;
  });

  cards.innerHTML = allCardsDiv.join('');
};

const updatePageCounter = () => {
  pageCounter.innerText = 'الصفحة رقم: ' + currPage;
};

// It will only run once (when the window is rendering for the first time)
chrome.storage.local.get('text', async ({ text }) => {
  const allHadith = await searchForHadithByText(text);
  currText = text;
  updateContent(allHadith);
});

next.addEventListener('click', async (e) => {
  e.preventDefault();
  // TODO: stop when get the last page
  currPage += 1;
  const allHadith = await searchForHadithByText(currText, currPage);
  updateContent(allHadith);
  updatePageCounter();
});
prev.addEventListener('click', async (e) => {
  e.preventDefault();
  if (currPage == 1) return;
  currPage -= 1;
  const allHadith = await searchForHadithByText(currText, currPage);
  updateContent(allHadith);
  updatePageCounter();
});
