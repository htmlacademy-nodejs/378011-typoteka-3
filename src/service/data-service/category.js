'use strict';
const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                Sequelize.col(`CategoryId`)
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: [],
        }]
      });
      return result.map((category) => category.get()).filter((it)=>it.count !== `0`);
    } else {
      return this._Category.findAll({raw: true});
    }
  }

  async findOne(id) {
    return this._Category.findByPk(id);
  }


  async update(id, category) {
    const [affectedRows] = await this._Category.update(category, {
      where: {id}
    });

    return !!affectedRows;
  }

  async delete(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async create(categoryData) {
    const category = await this._Category.create(categoryData);
    return category.get();
  }
}

module.exports = CategoryService;
