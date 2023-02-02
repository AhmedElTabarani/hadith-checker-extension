import {
  getAllHadith,
  getAllHadithInfo,
} from './utils/extractHadithInfo.js';

let currTabCards = document.getElementById('main-tab');
const bukhariTabCards = document.getElementById('bukhari-tab');
const muslimTabCards = document.getElementById('muslim-tab');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const pageCounter = document.querySelector('#page-counter span');
const hadithCounter = document.querySelector('#hadith-counter span');
const loader = document.getElementById('loader');

let currPage = 1;
let currTabId = 'main-tab';
let numberOfHadith;
let currText = '';
let dorarSearchLink = '';

const fetchHTML = async (url) => {
  const res = await fetch(encodeURI(url));
  const data = await res.json();
  return data;
};

const selectDataBaseOfTabId = {
  'main-tab': {
    bookIds: [0],
  },
  'bukhari-tab': {
    bookIds: [6216],
  },
  'muslim-tab': {
    bookIds: [3088],
  },
};

const searchForHadith = async () => {
  setLoader();
  const bookIds = selectDataBaseOfTabId[currTabId].bookIds;
  const booksQuery = bookIds.map((id) => `s[]=${id}`).join('&');

  const url = `https://dorar.net/dorar_api.json?skey=${currText}&${booksQuery}&page=${currPage}`;
  const res = await fetchHTML(url);
  const html = he.decode(res.ahadith.result);
  const data = await convertToJSON(html);
  return data;
};

const convertToJSON = async (html) => {
  try {
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
          <p class="hadith">${hadith}</p>
          <hr/>
          <div class="hadith-info">
            <span class="hadith-rawi"><span class="info-subtitle">الراوي:</span> ${el_rawi}</span>
            <span class="hadith-mohdith"><span class="info-subtitle">المحدث:</span> ${el_mohdith}</span>
            <span class="hadith-source"><span class="info-subtitle">المصدر:</span> ${source}</span>
            <span class="hadith-number"><span class="info-subtitle">رقم الحديث أو الصفحة:</span> ${number_or_page}</span>
            <span class="hadith-grade"><span class="info-subtitle">صحة الحديث:</span> ${grade}</span>
          </div>
        </div>
        <button class="copy-btn nice-btn" type="button">نسخ الحديث</button>
      </div>`;
  });

  currTabCards.innerHTML = `
  <section class="cards">
    ${allCardsDiv.join('')}
    <a class='dorar-search-link' href=${dorarSearchLink} target='_blank'>البحث في موقع الدرر السَنية</a>;
  </section>
  `;

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
  currTabCards.innerHTML = '';
};

const hideLoader = () => {
  loader.className = 'loader-hide';
};

// It will only run once (when the window is rendering for the first time)
chrome.storage.local.get('text', async ({ text }) => {
  currText = text;
  const allHadith = await searchForHadith();
  dorarSearchLink = `https://dorar.net/hadith/search?q=${currText}`;
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
  currPage += 1;
  const allHadith = await searchForHadith();
  numberOfHadith = allHadith.length;
  if (numberOfHadith === 0) {
    currPage -= 1;
    showMessage('<span>لا توجد نتائج أُخرى</span>');
    return;
  }
  updateContent(allHadith);
  updatePageCounter();
  updateHadithCounter();
});
prev.addEventListener('click', async (e) => {
  e.preventDefault();
  if (currPage === 1) return;
  currPage -= 1;
  const allHadith = await searchForHadith();
  numberOfHadith = allHadith.length;
  updateContent(allHadith);
  updatePageCounter();
  updateHadithCounter();
});

Array.from(document.getElementsByClassName('tab-btn')).forEach(
  (tabBtn) => {
    tabBtn.addEventListener('click', async (e) => {
      const tabContent =
        document.getElementsByClassName('tab-content');
      for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = 'none';
      }
      const ele = e.target;

      Array.from(
        document.getElementsByClassName('tab-links'),
      ).forEach((tabLink) =>
        tabLink === e.target
          ? ele.classList.add('active')
          : tabLink.classList.remove('active'),
      );
      currTabId = ele.dataset.tabid;
      currTabCards = document.getElementById(currTabId);
      currTabCards.style.display = 'block';

      const allHadith = await searchForHadith();
      numberOfHadith = allHadith.length;
      if (numberOfHadith === 0) {
        showMessage(
          '<span>لا توجد أي نتائج، حاول أن تحدد عدد كلمات أكثر</span><br/><span>أو أن تحدد نص عربي تعتقد أنه حديث</span>',
        );
        return;
      }
      updateContent(allHadith);
      updatePageCounter();
      updateHadithCounter();
    });
  },
);
