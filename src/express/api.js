'use strict';

const axios = require(`axios`);
const {HttpMethod} = require(`./lib/constants`);

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  getArticles({offset, limit, comments}) {
    return this._load(`/articles`, {params: {offset, limit, comments}});
  }

  getArticlesByCategories({offset, limit, category}) {
    return this._load(`/articles/byCategories`, {params: {offset, limit, category}});
  }

  getArticle(id, comments) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(count) {
    return this._load(`/category`, {params: {count}});
  }

  getCategory(id) {
    return this._load(`/category/${id}`);
  }

  editCategory(id, data) {
    return this._load(`/category/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  deleteCategory(id) {
    return this._load(`/category/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  createCategory(data) {
    return this._load(`/category`, {
      method: HttpMethod.POST,
      data
    });
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  signIn(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }

  deleteArticle(id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  getComments() {
    return this._load(`/articles/comments`);
  }

  deleteComment(articleId, commentId) {
    return this._load(`/articles/${articleId}/comments/${commentId}`, {
      method: HttpMethod.DELETE,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

}

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};

