'use strict';

const {Router} = require(`express`);
const api = require(`./../api`).getAPI();
const myRouter = new Router();
const auth = require(`../middlewares/auth`);

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const allArticles = await api.getArticles({comments: false});
  const articles = allArticles.filter((article)=> article.userId === user.id);
  res.render(`my/my`, {articles, user});
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const comments = await api.getComments();
  res.render(`my/comments`, {comments, user});
});


myRouter.get(`/delete/:id`, auth, async (req, res) => {
  const {id} = req.params;
  await api.deleteArticle(id);
  res.redirect(`/my`);
});

myRouter.get(`/comments/delete`, auth, async (req, res) => {
  const {articleId, commentId} = req.query;
  try {
    await api.deleteComment(articleId, commentId);
    res.redirect(`/my/comments`);
  } catch (error) {
    res.redirect(`/my/comments/?error=${encodeURIComponent(error.response.data.message)}&currentId=${commentId}`);
  }
});
module.exports = myRouter;
