'use strict';
const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string()
  .min(30)
  .max(250)
  .required(),

  announce: Joi.string()
  .min(30)
  .max(250)
  .required(),

  fullText: Joi.string()
  .max(1000),

  categories: Joi.array()
  .items(Joi.number())
  .min(1)
  .required(),

  picture: Joi.string()
  .optional()
  .allow(``),

  createdDate: Joi.date()
  .required(),

  userId: Joi.number().integer().positive().required()

});
