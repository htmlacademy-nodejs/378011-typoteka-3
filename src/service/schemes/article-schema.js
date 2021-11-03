'use strict';
const Joi = require(`joi`);

const ErrorArticleMessage = {
  CATEGORIES: `categories: Не выбрана ни одна категория объявления`,
  TITLE_MIN: `title: Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `title: Заголовок не может содержать более 250 символов`,
  ANNOUNCE_MIN: `announce: Анонс содержит меньше 30 символов`,
  ANNOUNCE_MAX: `announce: Анонс не может содержать более 250 символов`,
  FULL_TEXT_MAX: `fullText: Полный текст публикации не может содержать более 1000 символов`,
  PICTURE: `picture: Тип изображения не поддерживается`,
};

module.exports = Joi.object({
  title: Joi.string()
  .min(30)
  .max(250)
  .required().messages({
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX
  }),

  announce: Joi.string()
  .min(30)
  .max(250)
    .required().messages({
      'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
      'string.max': ErrorArticleMessage.ANNOUNCE_MAX
    }),

  fullText: Joi.string()
  .optional()
  .max(1000)
    .required().messages({
      'string.max': ErrorArticleMessage.FULL_TEXT_MAX
    })
  .allow(``),

  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorArticleMessage.CATEGORIES
      })
  ).min(1).required(),

  picture: Joi.string()
  .optional()
  .allow(``),

  createdDate: Joi.date()
  .required(),

  userId: Joi.number().integer().positive().required()

});
