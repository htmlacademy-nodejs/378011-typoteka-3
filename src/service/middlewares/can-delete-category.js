'use strict';
const {HttpCode} = require(`../cli/constants`);

module.exports = (categoryService, articleService) => async (req, res, next) => {
  const {categoryId} = req.params;
  const {body} = req;
  const limit = 8;
  const offset = 0;
  const category = categoryId;
  const article = await articleService.findAllByCategory({limit, offset, category});
  if (article.count) {
    return res.status(HttpCode.BAD_REQUEST)
      .json({
        message: `Категория не может быть удалена если ей принадлежит хотя бы одна публикация`,
        data: body
      });
  }

  return next();
};
