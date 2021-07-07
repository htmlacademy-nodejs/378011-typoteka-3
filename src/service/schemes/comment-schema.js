'use strict';
const Joi = require(`joi`);
const {
  MIN_COMMENTS_LENGTH,
} = require(`../cli/constants`);

module.exports = Joi.object({
  text: Joi.string().min(MIN_COMMENTS_LENGTH).required()
});
