"use strict";
const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {

}

const define = (sequelize) => Article.init({
  announce: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fullText: {
    type: DataTypes.TEXT
  },
  picture: DataTypes.STRING,
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

module.exports = define;
