'use strict';
const {Router} = require(`express`);
const {HttpCode} = require(`../cli/constants`);
const schemeValidator = require(`../middlewares/scheme-validator`);
const categorySchema = require(`../schemes/category-schema`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const categoryValidator = require(`../middlewares/can-delete-category`);


module.exports = (app, categoryService, articleService) => {
  const route = new Router();
  app.use(`/category`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await categoryService.findAll(count);
    res.status(HttpCode.OK)
    .json(categories);
  });

  route.get(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const category = await categoryService.findOne(categoryId);
    res.status(HttpCode.OK)
      .json(category);
  });

  route.put(`/:categoryId`, [routeParamsValidator, schemeValidator(categorySchema)], async (req, res) => {
    const {categoryId} = req.params;
    const updated = await categoryService.update(categoryId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${categoryId}`);
    }
    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  route.delete(`/:categoryId`, categoryValidator(categoryService, articleService), async (req, res) => {
    const {categoryId} = req.params;
    const deleted = await categoryService.delete(categoryId);

    if (!deleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found ${categoryId} category`);
    }
    return res.status(HttpCode.OK)
      .json(deleted);
  });

  route.post(`/`, schemeValidator(categorySchema), async (req, res) => {
    const category = await categoryService.create(req.body);
    return res.status(HttpCode.CREATED)
      .json(category);
  });

};
