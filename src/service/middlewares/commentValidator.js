'use strict';
const {
  HttpCode,
  commentKeys,
} = require(`../cli/constants`);


module.exports = (req, res, next) => {
  const comment = req.body;
  const keys = Object.keys(comment);
  const keysExists = commentKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST)
    .send(`Bad request`);
  }

  next();
};
