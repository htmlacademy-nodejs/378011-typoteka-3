'use strict';
const {
  HttpCode,
} = require(`../cli/constants`);


module.exports = (service) => async (req, res, next) => {
  const {body} = req;
  const userByEmail = await service.findByEmail(req.body.email);


  if (userByEmail) {
    return res.status(HttpCode.BAD_REQUEST)
    .json({
      message: `Такой емейл уже используется`,
      data: body
    });
  }

  return next();
};
