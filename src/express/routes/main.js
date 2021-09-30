'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`./../api`).getAPI();
const upload = require(`./../../service/middlewares/upload`);
const auth = require(`../middlewares/auth`);

const ARTICLES_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;

  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true)
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main/main`, {articles, page, user, totalPages, categories});

});


mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;
  const {error} = req.query;
  const errors = error ? error.split(`,`) : [];
  res.render(`main/sign-up`, {errors, user});
});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userFullName = `${body[`user-name`]} ${body[`user-surname`]}`;
  const userData = {
    name: userFullName,
    email: body[`user-email`],
    password: body[`user-password`],
    passwordRepeated: body[`user-password-again`]
  };

  if (file) {
    userData.avatar = file.filename;
  }

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (error) {
    res.redirect(`/register?error=${encodeURIComponent(error.response.data.message)}`);
  }
});

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  const {error} = req.query;
  res.render(`main/login`, {error, user});
});


mainRouter.post(`/login`, async (req, res) => {
  try {
    const user = await api.auth(req.body[`email`], req.body[`password`]);
    req.session.user = user;
    res.redirect(`/`);
  } catch (error) {
    const currentError = error.response.data;
    res.render(`main/login`, {currentError});
  }
});
mainRouter.get(`/categories`, auth, (req, res) => {
  const {user} = req.session;
  res.render(`main/all-categories`, {user});
});
mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  try {
    const {search} = req.query;
    const results = await api.search(search);

    res.render(`main/search-result`, {
      results, user
    });
  } catch (error) {
    res.render(`main/search-result`, {
      results: [], user
    });
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  req.session.save(() => {
    res.redirect(`/`);
  });
});

module.exports = mainRouter;
