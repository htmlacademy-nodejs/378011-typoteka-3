'use strict';

const {Op} = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._User = sequelize.models.User;
  }

  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      order: [
        [`createdDate`, `DESC`],
      ],
      include: [Aliase.CATEGORIES,
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
    });
    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
