import { searchForHadith } from './utils/searchForHadith.js';
import { convertHTMLHadithToJSON } from './utils/convertHTMLHadithToJSON.js';
const content = document.getElementById('content');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const pageCounter = document.querySelector('#page-counter span');
const hadithCounter = document.querySelector('#hadith-counter span');
const loader = document.getElementById('loader');
const settings = document.querySelector('.settings-box');

let currPage = 1;
let currTabId = 'main-tab';
let numberOfHadith;
let currText = '';
let dorarSearchLink = '';
let currQuery = '';

const getHadith = async (query = '') => {
  setLoader();

  if (currTabId === 'bukhari-tab') query = 's[]=6216&st=p'; // بحث مطابق في صحيح البخاري فقط
  else if (currTabId === 'muslim-tab') query = 's[]=3088&st=p'; // بحث مطابق في صحيح مسلم فقط

  const html = await searchForHadith(currText, currPage, query);
  const data = convertHTMLHadithToJSON(html);
  numberOfHadith = data.length;
  if (numberOfHadith === 0) {
    showMessage(
      `<span>لا توجد أي نتائج</span>
      <br/>`,
    );
    return;
  } else showMessage('');

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
  content.style.display = 'none';
};

const hideLoader = () => {
  loader.className = 'loader-hide';
  content.style.display = 'block';
};

// It will only run once (when the window is rendering for the first time)
chrome.storage.local.get('text', ({ text }) => {
  currText = text;
  dorarSearchLink = `https://dorar.net/hadith/search?q=${currText}`;

  chrome.storage.local.get('options', async ({ options }) => {
    const query = Object.values(options)
      .filter((option) => option.value.length > 0)
      .map((option) => {
        if (Array.isArray(option.value))
          return option.value
            .map((value) => `${option.id}=${value}`)
            .join('&');
        else return `${option.id}=${option.value}`;
      })
      .join('&');
    currQuery = query;
    await getHadith(query);
  });
});

next.addEventListener('click', async (e) => {
  e.preventDefault();
  currPage += 1;
  const allHadith = await getHadith(currQuery);
  if (!allHadith) {
    currPage -= 1;
    return;
  }
});
prev.addEventListener('click', async (e) => {
  e.preventDefault();
  if (currPage === 1) return;
  currPage -= 1;
  await getHadith(currQuery);
});

// Switching tabs
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
      if (currTabId !== 'main-tab') settings.style.display = 'none';
      else settings.style.display = 'block';

      content.innerHTML = '';
      await getHadith(currQuery);
    });
  },
);
