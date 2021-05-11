'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`./../api`).getAPI();


mainRouter.get(`/`, async (req, res) => {
  const [
    articles,
    categories
  ] = await Promise.all([
    api.getArticles({comments: false}),
    api.getCategories(true)
  ]);

  res.render(`main/main`, {articles, categories});
});

mainRouter.get(`/register`, (req, res) => res.render(`main/sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`main/login`));
mainRouter.get(`/categories`, (req, res) => res.render(`main/all-categories`));
mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);

    res.render(`main/search-result`, {
      results
    });
  } catch (error) {
    res.render(`main/search-result`, {
      results: []
    });
  }
});

module.exports = mainRouter;
