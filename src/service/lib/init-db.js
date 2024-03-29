"use strict";

const defineModels = require(`../models/define-models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {categories, articles, users}, filldb) => {
  const {Category, Article, User} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((it) => ({name: it}))
  );

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  const userModels = await User.bulkCreate(users, {include: [Aliase.ARTICLES, Aliase.COMMENTS]});

  const userIdByEmail = userModels.reduce((acc, next) => ({
    [next.email]: next.id,
    ...acc
  }), {});

  articles.forEach((article) => {
    article.userId = userIdByEmail[article.user];
    article.comments.forEach((comment) => {
      comment.userId = userIdByEmail[comment.user];
    });
  });

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Aliase.COMMENTS]});

    await articleModel.addCategories(article.categories.map((name) => categoryIdByName[name]));
  });
  await Promise.all(articlePromises);
  if (filldb) {
    process.exit(0);
  }

};
