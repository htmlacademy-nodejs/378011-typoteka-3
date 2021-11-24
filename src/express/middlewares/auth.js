'use strict';

const {UserRole} = require(`./../lib/constants`);

module.exports = (req, res, next) => {
  const {user} = req.session;

  if (!user) {
    return res.redirect(`/login`);
  } else if (user.role !== UserRole.admin) {
    return res.redirect(`/`);
  }
  return next();
};
