import {
  getAllHadith,
  getAllHadithInfo,
} from './utils/extractHadithInfo.js';

const cards = document.getElementsByClassName('cards')[0];
const next = document.getElementById('next');
const shareButton = document.querySelectorAll('#share-button');
const prev = document.getElementById('prev');
const pageCounter = document.querySelector('#page-counter span');
const hadithCounter = document.querySelector('#hadith-counter span');

let currPage = 1;
let numberOfHadith;
let currText = '';

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
    const {
      hadith,
      el_rawi,
      el_mohdith,
      source,
      number_or_page,
      grade,
    } = _hadith;

    return `<div class="card">
             <p class="hadith-text">${hadith}</p>
             <div class="hadith-info">
                <p class="hadith-rawi"><span>الراوي:</span> ${el_rawi}</p>
                <p class="hadith-mohdith"><span>المتحدث:</span> ${el_mohdith}</p>
                <p class="hadith-source"><span>المصدر:</span> ${source}</p>
                <p class="hadith-number"><span>رقم الحديث أو الصفحة:</span> ${number_or_page}</p>
                <p class="hadith-grade"><span>صحة الحديث:</span> ${grade}</p>
             </div>
             <button id="share-button" data-hadith=${hadith}>
             <svg aria-hidden="true" data-prefix="fal" data-icon="share-square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-share-square fa-w-18 fa-7x"><path fill="currentColor" d="M566.633 169.37L406.63 9.392C386.626-10.612 352 3.395 352 32.022v72.538C210.132 108.474 88 143.455 88 286.3c0 84.74 49.78 133.742 79.45 155.462 24.196 17.695 58.033-4.917 49.7-34.51C188.286 304.843 225.497 284.074 352 280.54V352c0 28.655 34.654 42.606 54.63 22.63l160.003-160c12.489-12.5 12.489-32.76 0-45.26zM384 352V248.04c-141.718.777-240.762 15.03-197.65 167.96C154.91 393 120 351.28 120 286.3c0-134.037 131.645-149.387 264-150.26V32l160 160-160 160zm37.095 52.186c2.216-1.582 4.298-3.323 6.735-5.584 7.68-7.128 20.17-1.692 20.17 8.787V464c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h172.146c6.612 0 11.954 5.412 11.852 12.04-.084 5.446-4.045 10.087-9.331 11.396-9.462 2.343-18.465 4.974-27.074 7.914-1.25.427-2.555.65-3.876.65H48c-8.837 0-16 7.163-16 16v352c0 8.837 7.163 16 16 16h352c8.837 0 16-7.163 16-16v-50.002c0-3.905 1.916-7.543 5.095-9.812z" class=""></path></svg>
             <button>
        </div>`;
  });

  cards.innerHTML = allCardsDiv.join('');
};
const shareIt = (hadith) => {
  if (hadith) {
    navigator.share({
      title: 'Hadith checker',
      text: hadith,
      url: './icons/icons128.png',
    });
  }
};
// if navigator.share supported then add event listener  on click to all share butons instances
// if navigator.share is not supported then add style.display none to all share button instances
shareButton.forEach((box) => {
  if (!navigator.share) {
    box.style.display = 'none';
  }
  box.addEventListener('click', () => shareIt(box.dataset.hadith));
});
const updatePageCounter = () => {
  pageCounter.innerText = currPage;
};
const updateHadithCounter = () => {
  hadithCounter.innerText = numberOfHadith;
};

const showMessage = (text) => {
  const message = document.getElementById('message');
  message.innerHTML = text;
  updatePageCounter();
  updateHadithCounter();
};

// It will only run once (when the window is rendering for the first time)
chrome.storage.local.get('text', async ({ text }) => {
  const allHadith = await searchForHadithByText(text);
  currText = text;
  numberOfHadith = allHadith.length;
  if (numberOfHadith === 0) {
    showMessage(
      '<span>لا يوجد أي نتائج، حاول أن تحدد عدد كلمات أكثر</span><br/><span>أو أن تحدد نص عربي تعتقد أنه حديث</span>',
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
    showMessage('<span>لا يوجد نتائج أُخرى</span>');
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
