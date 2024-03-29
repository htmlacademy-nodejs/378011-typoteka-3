'use strict';

const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }

  async delete(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  findAll(articleId) {
    const include = [
      Aliase.ARTICLES,
      {
        model: this._Article,
        as: Aliase.ARTICLES,
        attributes: {
          exclude: [`announce`, `fullText`, `picture`, `userId`, `createdAt`, `updatedAt`]
        }
      },
      Aliase.USERS,
      {
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      },
    ];
    if (articleId) {
      return this._Comment.findAll({
        where: {articleId},
        raw: true
      });
    }
    return this._Comment.findAll({
      include,
      order: [
        [`createdAt`, `DESC`],
      ],
    });
  }

}

module.exports = CommentService;
