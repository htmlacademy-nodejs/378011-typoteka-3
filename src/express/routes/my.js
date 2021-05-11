'use strict';

const {Router} = require(`express`);
const api = require(`./../api`).getAPI();
const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles({comments: false});
  res.render(`my/my`, {articles});
});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles({comments: true});
  res.render(`my/comments`, {articles: articles.slice(0, 3)});
});

module.exports = myRouter;
