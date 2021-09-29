'use strict';

const {Router} = require(`express`);
const {HttpCode, UserRole} = require(`../cli/constants`);
const userValidator = require(`../middlewares/user-validator`);
const passwordUtils = require(`../lib/password`);
const schemeValidator = require(`../middlewares/scheme-validator`);
const userSchema = require(`../schemes/user-schema`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/user`, route);

  route.post(`/`, [schemeValidator(userSchema), userValidator(service)], async (req, res) => {
    const data = req.body;

    data.passwordHash = await passwordUtils.hash(data.password);
    const allUsers = await service.findUsers();
    data.role = allUsers ? UserRole.member : UserRole.admin;

    const result = await service.create(data);

    delete result.passwordHash;


    res.status(HttpCode.CREATED)
    .json(result);
  });

  route.post(`/auth`, async (req, res) => {
    const {email, password} = req.body;
    const user = await service.findByEmail(email);
    if (!user) {
      res.status(HttpCode.UNAUTHORIZED).send(`Email is incorrect`);
      return;
    }

    const passwordIsCorrect = await passwordUtils.compare(password, user.passwordHash);
    if (passwordIsCorrect) {
      delete user.passwordHash;
      res.status(HttpCode.OK).json(user);
    } else {
      res.status(HttpCode.UNAUTHORIZED).send(`Password is incorrect`);
    }
  });
};
