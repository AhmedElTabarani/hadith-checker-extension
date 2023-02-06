import { searchForHadith } from './utils/searchForHadith.js';
import { convertHTMLHadithToJSON } from './utils/convertHTMLHadithToJSON.js';

const content = document.getElementById('content');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const pageCounter = document.querySelector('#page-counter span');
const hadithCounter = document.querySelector('#hadith-counter span');
const loader = document.getElementById('loader');
const degreeCheckbox =
  document.getElementsByClassName('degreeCheckbox');

let currPage = 1;
let currTabId = 'main-tab';
let numberOfHadith;
let currText = '';
let dorarSearchLink = '';

let currDegrees = [false, false, false, false];

// TODO: can convert it to class ?
const getQuery = () => {
  const query = {};
  const dataTab = {
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

  query.books = dataTab[currTabId].bookIds
    .map((id) => `s[]=${id}`)
    .join('&');

  query.degrees = currDegrees
    .map((d, i) => (d ? `d[]=${i + 1}` : d))
    .filter((d) => d !== false)
    .join('&');

  return query;
};

const getHadith = async () => {
  setLoader();
  const query = getQuery();
  const html = await searchForHadith(currText, currPage, query);
  const data = convertHTMLHadithToJSON(html);
  numberOfHadith = data.length;
  if (numberOfHadith === 0) {
    showMessage(
      `<span>لا توجد أي نتائج، حاول أن تحدد نصًا أخر، أو عدد كلمات أكثر</span>
      <span>أو أن تحدد نص عربي تعتقد أنه حديث</span>
      <br/>`,
    );
    return;
  }
  updateContent(data);
  hideLoader();
  return data;
};

// tODO: refactor this function or divide it or do anything to it !!
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

  content.innerHTML = `
  <section class="cards">
    ${allCardsDiv.join('')}
    <a class='dorar-search-link' href=${dorarSearchLink} target='_blank'>البحث في موقع الدرر السَنية</a>;
  </section>
  `;

  updatePageCounter();
  updateHadithCounter();

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
};

const setLoader = () => {
  loader.className = 'center';
  content.innerHTML = '';
};

const hideLoader = () => {
  loader.className = 'loader-hide';
};

// It will only run once (when the window is rendering for the first time)
chrome.storage.session.get('text', async ({ text }) => {
  currText = text;
  dorarSearchLink = `https://dorar.net/hadith/search?q=${currText}`;

  const { degrees } = await chrome.storage.sync.get('degrees');
  currDegrees = degrees || currDegrees;

  // TODO: move it to a function
  Array.from(degreeCheckbox).forEach((checkbox, i) => {
    checkbox.checked = currDegrees[i];
    checkbox.addEventListener('click', async (e) => {
      const value = +e.target.value;
      currDegrees[value - 1] = !currDegrees[value - 1];
      await chrome.storage.sync.set({ degrees: currDegrees });
    });
  });
  await getHadith();
});

next.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log(currPage);
  currPage += 1;
  const allHadith = await getHadith();
  if (!allHadith) {
    currPage -= 1;
    return;
  }
});
prev.addEventListener('click', async (e) => {
  e.preventDefault();
  if (currPage === 1) return;
  currPage -= 1;
  await getHadith();
});

// tODO: can make it better ?
Array.from(document.getElementsByClassName('tab-btn')).forEach(
  (tabBtn) => {
    tabBtn.addEventListener('click', async (e) => {
      const ele = e.target;

      Array.from(
        document.getElementsByClassName('tab-links'),
      ).forEach((tabLink) =>
        tabLink === e.target
          ? ele.classList.add('active')
          : tabLink.classList.remove('active'),
      );
      currTabId = ele.dataset.tabid;
      await getHadith();
    });
  },
);
