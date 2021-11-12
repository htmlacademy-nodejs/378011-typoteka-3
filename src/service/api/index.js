'use strict';
const {Router} = require(`express`);
const category = require(`../api/category`);
const article = require(`../api/article`);
const search = require(`../api/search`);
const user = require(`../api/user`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
  UserService
} = require(`../data-service`);

const app = new Router();

defineModels(sequelize);

(() => {
  category(app, new CategoryService(sequelize), new ArticleService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize), new UserService(sequelize));
  user(app, new UserService(sequelize));
})();

module.exports = app;
