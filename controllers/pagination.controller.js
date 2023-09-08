const pageCounter = document.querySelector('#page-counter span');

class Pagination {
  constructor() {
    this.page = 1;
    pageCounter.textContent = this.page;
  }

  getPage = () => {
    return this.page;
  };

  nextPage = () => {
    this.page += 1;
    pageCounter.textContent = this.page;
  };

  prevPage = () => {
    this.page -= 1;
    pageCounter.textContent = this.page;
  };

  goToPage = (page) => {
    this.page = page;
    pageCounter.textContent = this.page;
  };
}

export default new Pagination();
