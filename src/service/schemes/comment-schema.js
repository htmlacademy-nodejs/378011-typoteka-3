'use strict';
const Joi = require(`joi`);

module.exports = Joi.object({
  text: Joi.string().min(6).required().messages({
    'string.min': `Комментарий должен быть не меньше 20 символов`
  }),
  userId: Joi.number().integer().positive().required()
});
