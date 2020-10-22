'use strict';
class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  searchArticles(query) {
    const filteredArticles = this._articles.filter((article)=>article.title.includes(query));

    return [...filteredArticles];
  }
}

module.exports = SearchService;
