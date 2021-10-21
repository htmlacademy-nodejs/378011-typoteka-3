'use strict';

const {Router} = require(`express`);
const upload = require(`./../../service/middlewares/upload`);
const auth = require(`../middlewares/auth`);
const {ensureArray} = require(`./../../service/cli/utils`);
const csrf = require(`csurf`);
const csrfProtection = csrf();

const api = require(`./../api`).getAPI();
const articlesRouter = new Router();


articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));
articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {error} = req.query;
  const categories = await api.getCategories();
  res.render(`articles/new-post`, {
    prevArticleData: {
      title: ``,
      createdDate: new Date(),
      announce: ``,
      fullText: ``,
      picture: ``,
      categories: ``,
    },
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
  const articleData = {
    title: body.title,
    createdDate: body.createdDate || `${currentDate}, ${currentDate.getTime()}`,
    announce: body.announce,
    fullText: body.fullText,
    categories: ensureArray(body.categories),
    picture: file || ``,
    userId: user.id,
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/`);
  } catch (error) {
    res.redirect(`/articles/add?error=${encodeURIComponent(error.response.data.message)}`);
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
  res.render(`articles/edit-article`, {id, article, categories, error, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/edit/:id`, upload.single(`picture`), auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    picture: file ? file.filename : body[`old-image`],
    fullText: body.fullText,
    announce: body.announce,
    title: body.title,
    categories: ensureArray(body.categories),
    createdDate: body.createdDate,
    userId: user.id,
  };

  try {
    await api.editArticle(id, articleData);
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
  try {
    await api.createComment(id, {userId: user.id, text});
    res.redirect(`/articles/${id}`);
  } catch (error) {
    res.redirect(`/articles/${id}?error=${encodeURIComponent(error.response.data.message)}`);
  }
});


module.exports = articlesRouter;
