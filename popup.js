import {
  getAllHadith,
  getAllHadithInfo,
} from './utils/extractHadithInfo.js';

const cards = document.getElementsByClassName('cards')[0];
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const pageCounter = document.querySelector('#page-counter span');
const hadithCounter = document.querySelector('#hadith-counter span');
const loader = document.getElementById('loader');

let currPage = 1;
let numberOfHadith;
let currText = '';
let dorarSearchLink = '';

const searchForHadithByText = async (text, page = 1) => {
  setLoader();
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
    const {
      hadith,
      el_rawi,
      el_mohdith,
      source,
      number_or_page,
      grade,
    } = _hadith;

    return `
      <div class="card">
        <div>
          <p class="hadith-text">${hadith}</p>
          <div class="hadith-info">
            <p class="hadith-rawi"><span>الراوي:</span> ${el_rawi}</p>
            <p class="hadith-mohdith"><span>المحدث:</span> ${el_mohdith}</p>
            <p class="hadith-source"><span>المصدر:</span> ${source}</p>
            <p class="hadith-number"><span>رقم الحديث أو الصفحة:</span> ${number_or_page}</p>
            <p class="hadith-grade"><span>صحة الحديث:</span> ${grade}</p>
          </div>
        </div>
        <button class="copy-btn nice-btn" type="button">نسخ الحديث</button>
      </div>`;
  });

  cards.innerHTML =
    allCardsDiv.join('') +
    `<a class='dorar-search-link' href=${dorarSearchLink} target='_blank'>البحث في موقع الدرر السَنية</a>`;

  const copyButtons = document.getElementsByClassName('copy-btn');
  for (let btn of copyButtons) {
    btn.addEventListener('click', (e) => {
      const content = e.target.previousElementSibling;
      const text =
        content.innerText +
        '\n\n' +
        `البحث في موقع الدرر السَنية: ${dorarSearchLink}`;

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

  hideLoader();
};

const updatePageCounter = () => {
  pageCounter.innerText = currPage;
};
const updateHadithCounter = () => {
  hadithCounter.innerText = numberOfHadith;
};

const showMessage = (text) => {
  hideLoader();
  const message = document.getElementById('message');
  message.innerHTML = text;
  updatePageCounter();
  updateHadithCounter();
};

const setLoader = () => {
  loader.className = 'center';
  cards.innerHTML = '';
};

const hideLoader = () => {
  loader.className = 'loader-hide';
};

// It will only run once (when the window is rendering for the first time)
chrome.storage.local.get('text', async ({ text }) => {
  const allHadith = await searchForHadithByText(text);
  currText = text;
  dorarSearchLink = encodeURI(
    `https://dorar.net/hadith/search?q=${currText}`,
  );
  numberOfHadith = allHadith.length;
  if (numberOfHadith === 0) {
    showMessage(
      '<span>لا توجد أي نتائج، حاول أن تحدد عدد كلمات أكثر</span><br/><span>أو أن تحدد نص عربي تعتقد أنه حديث</span>',
    );
    return;
  }
  updatePageCounter();
  updateHadithCounter();
  updateContent(allHadith);
});

next.addEventListener('click', async (e) => {
  e.preventDefault();
  const allHadith = await searchForHadithByText(
    currText,
    currPage + 1,
  );
  if (allHadith.length === 0) {
    showMessage('<span>لا توجد نتائج أُخرى</span>');
    return;
  }
  currPage += 1;
  updateContent(allHadith);
  updatePageCounter();
  updateHadithCounter();
});
prev.addEventListener('click', async (e) => {
  e.preventDefault();
  if (currPage === 1) return;
  currPage -= 1;
  const allHadith = await searchForHadithByText(currText, currPage);
  updateContent(allHadith);
  updatePageCounter();
});
