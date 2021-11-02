'use strict';

const {Router} = require(`express`);
const upload = require(`./../../service/middlewares/upload`);
const auth = require(`../middlewares/auth`);
const {ensureArray} = require(`./../../service/cli/utils`);
const csrf = require(`csurf`);
const csrfProtection = csrf();
const {ARTICLES_PER_PAGE} = require(`./../../service/cli/constants`);
const {findErrorTextByType} = require(`./../lib/utils`);

const api = require(`./../api`).getAPI();
const articlesRouter = new Router();


articlesRouter.get(`/category/:id`, auth, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;

  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [{count, articles}, categories, category] = await Promise.all([
    api.getArticlesByCategories({limit, offset, category: id}),
    api.getCategories(true),
    api.getCategory(id),
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  res.render(`articles/articles-by-category`, {page, categories, category, user, totalPages, articles});
});

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {error} = req.query;
  const categories = await api.getCategories();
  res.render(`articles/new-post`, {
    categories,
    error,
    user,
    csrfToken: req.csrfToken()
  });
});

articlesRouter.post(`/add`, upload.single(`picture`), auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const currentDate = new Date();
  const categories = await api.getCategories();
  const articleData = {
    title: body.title,
    createdDate: body.createdDate || `${currentDate}, ${currentDate.getTime()}`,
    announce: body.announce,
    fullText: body.fullText,
    categories: ensureArray(body.categories),
    userId: user.id,
  };

  if (file) {
    articleData.picture = file.filename;
  }

  try {
    await api.createArticle(articleData);
    res.redirect(`/`);
  } catch (error) {
    const parsedError = error.response.data.message.map((it)=>it.split(`:`));
    const titleError = findErrorTextByType(parsedError, `title`);
    const announceError = findErrorTextByType(parsedError, `announce`);
    const categoriesError = findErrorTextByType(parsedError, `categories`);
    const fullTextError = findErrorTextByType(parsedError, `fullText`);
    const errorList = parsedError.map((it)=>it[1]);
    res.render(`articles/new-post`, {
      categories,
      errorList,
      titleError,
      announceError,
      categoriesError,
      fullTextError,
      user,
      csrfToken: req.csrfToken()
    });
  }
});
articlesRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {error} = req.query;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  const parsedError = error ? error.split(`,`).map((it)=>it.split(`:`)) : [];
  const titleError = findErrorTextByType(parsedError, `title`);
  const announceError = findErrorTextByType(parsedError, `announce`);
  const categoriesError = findErrorTextByType(parsedError, `categories`);
  const fullTextError = findErrorTextByType(parsedError, `fullText`);
  const errorList = parsedError.map((it)=>it[1]);
  res.render(`articles/edit-article`, {
    id, article, categories, user, csrfToken: req.csrfToken(),
    errorList,
    titleError,
    announceError,
    categoriesError,
    fullTextError,
  });
});

articlesRouter.post(`/edit/:id`, upload.single(`picture`), auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const {id} = req.params;
  const article = {
    picture: file ? file.filename : body[`old-image`],
    fullText: body.fullText,
    announce: body.announce,
    title: body.title,
    categories: ensureArray(body.categories),
    createdDate: body.createdDate,
    userId: user.id,
  };
  try {
    await api.editArticle(id, article);
    res.redirect(`/`);
  } catch (error) {
    res.redirect(`/articles/edit/${id}?error=${encodeURIComponent(error.response.data.message)}`);
  }
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {error} = req.query;
  const {user} = req.session;
  const article = await api.getArticle(id, true);
  res.render(`articles/post`, {article, id, error, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/:id/comments`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {text} = req.body;
  const article = await api.getArticle(id, true);
  try {
    await api.createComment(id, {userId: user.id, text});
    res.redirect(`/articles/${id}`);
  } catch (error) {
    const currentError = error.response.data.message[0];
    res.render(`articles/post`, {article, id, currentError, user, csrfToken: req.csrfToken()});
  }
});

module.exports = articlesRouter;
