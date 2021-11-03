'use strict';
const Joi = require(`joi`);

const ErrorRegisterMessage = {
  NAME: `имя и фамилия не должны содержать цифр и специальных символов`,
  EMAIL: `Некорректный электронный адрес`,
  PASSWORD: `Пароль должен быть не меньше 6 символов`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
};

module.exports = Joi.object({
  name: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': ErrorRegisterMessage.NAME
  }),
  email: Joi.string().email().required().messages({
    'string.email': ErrorRegisterMessage.EMAIL
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': ErrorRegisterMessage.PASSWORD
  }),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)).required().messages({
    'any.only': ErrorRegisterMessage.PASSWORD_REPEATED
  }),
  avatar: Joi.string()
});
