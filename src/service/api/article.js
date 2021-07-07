'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../cli/constants`);
const articleExist = require(`../middlewares/article-exist`);
const schemeValidator = require(`../middlewares/scheme-validator`);
const articleSchema = require(`../schemes/article-schema`);
const commentSchema = require(`../schemes/comment-schema`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, articleService, commentService) => {

  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments} = req.query;
    let result;
    if (limit || offset) {
      result = await articleService.findPage({limit, offset});
    } else {
      result = await articleService.findAll(comments);
    }
    res.status(HttpCode.OK).json(result);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;
    const article = await articleService.findOne(articleId, comments);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
    .json(article);
  });

  route.post(`/`, schemeValidator(articleSchema), async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED)
    .json(article);
  });

  route.put(`/:articleId`, [routeParamsValidator, schemeValidator(articleSchema)], async (req, res) => {
    const {articleId} = req.params;
    const updated = await articleService.update(articleId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found with ${articleId}`);
    }
    return res.status(HttpCode.OK)
    .send(`Updated`);
  });

  route.delete(`/:articleId`, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = await articleService.delete(articleId);

    if (!deletedArticle) {
      return res.status(HttpCode.NOT_FOUND)
      .json(deletedArticle);
    }

    return res.status(HttpCode.OK)
    .json(deletedArticle);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);

    return res.status(HttpCode.OK)
   .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), async (req, res) => {
    const {commentId} = req.params;
    const deletedComment = await commentService.delete(commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found`);
    }

    return res.status(HttpCode.OK)
    .json(deletedComment);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), schemeValidator(commentSchema)], (req, res) => {
    const {articleId} = req.params;

    const comment = commentService.create(articleId, req.body);

    return res.status(HttpCode.CREATED)
    .json(comment);
  });


};
