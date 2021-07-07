'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {ensureArray} = require(`./../../service/cli/utils`);
const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const api = require(`./../api`).getAPI();
const articlesRouter = new Router();

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));
articlesRouter.get(`/add`, async (req, res) => {
  const {error} = req.query;
  const categories = await api.getCategories();
  res.render(`articles/new-post`, {
    prevArticleData: {
      title: ``,
      createdDate: new Date(),
      announce: ``,
      fullText: ``,
      picture: ``,
      category: ``,
    },
    categories, error
  });
});

articlesRouter.post(`/add`, upload.single(`picture`), async (req, res) => {
  const {body, file} = req;
  const currentDate = new Date();
  const articleData = {
    title: body.title,
    createdDate: body.createdDate || `${currentDate}, ${currentDate.getTime()}`,
    announce: body.announce,
    fullText: body.fullText,
    categories: ensureArray(body.category),
    picture: file || ``,
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`/articles/add?error=${encodeURIComponent(error.response.data.message)}`);
  }
});
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const {error} = req.query;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  console.log(article, `article`);
  console.log(categories, `categories`);
  res.render(`articles/edit-article`, {id, article, categories, error});
});

articlesRouter.post(`/edit/:id`, upload.single(`picture`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  console.log(body);
  const articleData = {
    picture: file ? file.filename : body[`old-image`],
    fullText: body.fullText,
    announce: body.announce,
    title: body.title,
    categories: ensureArray(body.category),
    createdDate: body.createdDate,
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`/articles/edit/${id}?error=${encodeURIComponent(error.response.data.message)}`);
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const {error} = req.query;
  const article = await api.getArticle(id, true);
  res.render(`articles/post`, {article, id, error});
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {text} = req.body;
  try {
    await api.createComment(id, {text});
    res.redirect(`/articles/${id}`);
  } catch (error) {
    res.redirect(`/articles/${id}?error=${encodeURIComponent(error.response.data.message)}`);
  }
});


module.exports = articlesRouter;
