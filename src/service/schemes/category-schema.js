'use strict';
const Joi = require(`joi`);

const ErrorArticleMessage = {
  NAME_MIN: `Заголовок содержит меньше 5 символов`,
  NAME_MAX: `Заголовок не может содержать более 30 символов`,
};

module.exports = Joi.object({
  name: Joi.string()
    .min(5)
    .max(30)
    .required().messages({
      'string.min': ErrorArticleMessage.NAME_MIN,
      'string.max': ErrorArticleMessage.NAME_MAX
    }),
});
