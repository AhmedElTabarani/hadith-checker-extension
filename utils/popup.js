import {
  getAllHadith,
  getAllHadithInfo,
} from './utils/extractHadithInfo.js';
import {
  facebook,
  email,
  twitter,
  whatsapp,
  pinterest,
  telegram,
} from './utils/svg.js';
const cards = document.getElementsByClassName('cards')[0];
const next = document.getElementById('next');
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

    const url =
      'https://chrome.google.com/webstore/detail/hadith-checker/cfbllcckohbiiplkigbfllfphhakanke';
    const share = `
      <div class='facebook'>
      <a href='https://www.facebook.com/sharer.php?u=${url}&t=${hadith}' rel='noreferrer' target='_blank' title='شارك على فايسيوك'>
      ${facebook}
      </a>
    </div>
    <div class='email'>
    <a style='cursor: pointer;' rel='noreferrer' target='_blank' title='شارك على الإيمايل' href='mailto:?subject=Hadith Checker&body=
    ${hadith} :حديث نبوي
    %0d
    للمزيد من الأحاديث يرجى الضغط على الرابط  
    %0d      
    ${encodeURIComponent(url)}'>
    ${email}
    </a>
    </div>
    <div class='twitter'>
    <a href='http://twitter.com/share?url=${encodeURIComponent(
      url,
    )}&text=${hadith}' rel='noreferrer' target='_blank' title='شارك على تويتر'>
      ${twitter}
    </a>
  </div>
  <div class='pinterest'>
    <a href='https://pinterest.com/pin/create/button/?url=${url}&media=${url}&description=${hadith}' rel='noreferrer' target='_blank' title='شارك على بانتيراست'>
      ${pinterest}
    </a>
  </div> 
  <div class='whatsapp'>
    <a href='whatsapp://send?text=${
      hadith + ' ' + url
    }' rel='noreferrer' target='_top' title='شارك على واتساب'>
     ${whatsapp}
    </a>
  </div>
  <div class='telegram'>
    <a href='https://t.me/share/url?url=${url}&text=${hadith}' rel='noreferrer' target='_blank' title='شارك على تيليغرام'>
     ${telegram}
    </a>
  </div>    
    `;

    return `<div class="card">
             <p class="hadith-text">${hadith}</p>
             <div class="hadith-info">
                <p class="hadith-rawi"><span>الراوي:</span> ${el_rawi}</p>
                <p class="hadith-mohdith"><span>المتحدث:</span> ${el_mohdith}</p>
                <p class="hadith-source"><span>المصدر:</span> ${source}</p>
                <p class="hadith-number"><span>رقم الحديث أو الصفحة:</span> ${number_or_page}</p>
                <p class="hadith-grade"><span>صحة الحديث:</span> ${grade}</p>
                <div class="horizontal-center">
                ${share}
                </div>
             </div>
        </div>`;
  });

  cards.innerHTML = allCardsDiv.join('');
};

function shareIt(hadith) {
  const data = {
    title: 'Hadith checker',
    text: hadith,
    url: './icons/icons128.png',
  };
  if (navigator.share) {
    navigator
      .share({
        title: 'web.dev',
        text: 'Check out web.dev.',
        url: 'https://web.dev/',
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
  } else {
    console.log('error');
  }
}

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
// Listen for clicks on the entire window
document.addEventListener('click', function (event) {
  // If the clicked element has the `.click-me` class, it's a match!
  if (event.target.matches('.share-button')) {
    shareIt(event.target.dataset.hadith);
  }
});
