'use strict';
const Joi = require(`joi`);


module.exports = Joi.object({
  name: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+/).rule({
    message: `имя и фамилия не должны содержать цифр и специальных символов`
  }).required(),
  email: Joi.string().email().rule({
    message: `невалидный адрес электронной почты`
  }).required(),
  password: Joi.string().min(6).rule({
    message: `Пароль должен быть не меньше 6 символов`
  }).required(),
  passwordRepeated: Joi.any().equal(Joi.ref(`password`))
  .required()
  .label(`Confirm password`)
  .messages({'any.only': `Пароли не совпадают`}),
  avatar: Joi.string()
});
