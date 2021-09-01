'use strict';
const {describe, beforeAll, test, expect} = require(`@jest/globals`);

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../cli/constants`);

const {mockCategories, mockArticles} = require(`./mocks/mock-data-for-category`);
const {mockUsers} = require(`./mocks/mock-users`);
const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  category(app, new DataService(mockDB));
});

describe(`API returns category list`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
    .get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 categories`, () => expect(response.body.length).toBe(6));

  test(`Category names are IT, За жизнь, Робототехника, Железо, Кино, Разное`,
      () => expect(response.body.map((el)=>el.name)).toEqual(
          expect.arrayContaining([`IT`, `За жизнь`, `Робототехника`, `Железо`, `Кино`, `Разное`])
      )
  );

});
