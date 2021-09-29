'use strict';

const {Router} = require(`express`);
const api = require(`./../api`).getAPI();
const myRouter = new Router();
const auth = require(`../middlewares/auth`);

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: false});
  res.render(`my/my`, {articles, user});
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: true});
  res.render(`my/comments`, {articles: articles.slice(0, 3), user});
});

module.exports = myRouter;
