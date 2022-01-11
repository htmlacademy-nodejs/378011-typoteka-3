'use strict';
const Joi = require(`joi`);

const ErrorArticleMessage = {
  CATEGORIES_EMPTY: `categories: Не выбрана ни одна категория объявления`,
  TITLE_MIN: `title: Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `title: Заголовок не может содержать более 250 символов`,
  TITLE_EMPTY: `title: Заголовок не может быть пустым`,
  ANNOUNCE_MIN: `announce: Анонс содержит меньше 30 символов`,
  ANNOUNCE_MAX: `announce: Анонс не может содержать более 250 символов`,
  ANNOUNCE_EMPTY: `announce: Анонс не может быть пустым`,
  FULL_TEXT_MAX: `fullText: Полный текст публикации не может содержать более 1000 символов`,
};

module.exports = Joi.object({
  title: Joi.string()
  .min(30)
  .max(250)
  .required().messages({
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX,
    'string.empty': ErrorArticleMessage.TITLE_EMPTY
  }),

  announce: Joi.string()
  .min(30)
  .max(250)
    .required().messages({
      'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
      'string.max': ErrorArticleMessage.ANNOUNCE_MAX,
      'string.empty': ErrorArticleMessage.ANNOUNCE_EMPTY
    }),

  fullText: Joi.string()
  .optional()
  .max(1000)
    .messages({
      'string.max': ErrorArticleMessage.FULL_TEXT_MAX
    })
  .allow(``),

  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorArticleMessage.CATEGORIES_EMPTY
      })
  ).min(1).required(),

  picture: Joi.string()
  .optional()
  .allow(``),

  createdDate: Joi.date()
  .required(),

  userId: Joi.number().integer().positive().required()

});
