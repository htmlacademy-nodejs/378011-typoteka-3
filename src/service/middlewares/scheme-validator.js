'use strict';
const {
  HttpCode,
} = require(`../cli/constants`);

module.exports = (schema) => (
  async (req, res, next) => {
    const {body} = req;
    try {
      await schema.validateAsync(body, {abortEarly: false});
    } catch (err) {
      const {details} = err;
      return res.status(HttpCode.BAD_REQUEST).json({
        message: details.map((errorDescription) => errorDescription.message),
        data: body
      });
    }
    return next();
  }
);
