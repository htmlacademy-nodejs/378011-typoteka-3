'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

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
    categories,
  });
});
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories()
    ]);
    res.render(`articles/edit-article`, {article, categories});
  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post`));
articlesRouter.post(`/add`, upload.single(`picture`), async (req, res) => {
  const {body, file} = req;
  const currentDate = new Date();
  const articleData = {
    title: body.title,
    createdDate: body.createdDate || `${currentDate}, ${currentDate.getTime()}`,
    announce: body.announce,
    fullText: body.fullText,
    category: body.category,
    picture: file || ``,
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    const categories = await api.getCategories();
    res.render(`articles/new-post`, {
      prevArticleData: articleData,
      categories,
    });
  }
});

module.exports = articlesRouter;
