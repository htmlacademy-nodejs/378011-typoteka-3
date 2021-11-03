'use strict';
const {describe, beforeAll, test, expect} = require(`@jest/globals`);

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const ArticleService = require(`../data-service/article`);

const {HttpCode} = require(`../cli/constants`);

const {mockCategories, mockArticles} = require(`./mocks/mock-data-for-category`);
const {mockUsers} = require(`./mocks/mock-users`);
const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  category(app, new DataService(mockDB), new ArticleService(mockDB));
});

describe(`API returns category list`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
    .get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 14 categories`, () => expect(response.body.length).toBe(14));

  test(`Category names are IT, За жизнь, Робототехника, Железо, Кино, Разное`,
      () => expect(response.body.map((it)=>it.name)).toEqual(
          [
            `Деревья`,
            `За жизнь`,
            `Без рамки`,
            `Разное`,
            `IT`,
            `Музыка`,
            `Кино`,
            `Программирование`,
            `Железо`,
            `Читальный зал`,
            `Авто`,
            `Насущные проблемы России`,
            `DIY`,
            `Робототехника`
          ]
      )
  );

});

describe(`API returns category with counts`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/category?count=true`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 6 categories`, () => expect(response.body.length).toBe(14));

  test(`Category names and counts correct`,
      () => expect(response.body.map((it)=>it)).toEqual(
          [
            {
              "count": 0,
              "id": 1,
              "name": `Деревья`
            },
            {
              "count": 1,
              "id": 2,
              "name": `За жизнь`
            },
            {
              "count": 0,
              "id": 3,
              "name": `Без рамки`
            },
            {
              "count": 1,
              "id": 4,
              "name": `Разное`
            },
            {
              "count": 2,
              "id": 5,
              "name": `IT`
            },
            {
              "count": 0,
              "id": 6,
              "name": `Музыка`
            },
            {
              "count": 1,
              "id": 7,
              "name": `Кино`
            },
            {
              "count": 0,
              "id": 8,
              "name": `Программирование`
            },
            {
              "count": 1,
              "id": 9,
              "name": `Железо`
            },
            {
              "count": 0,
              "id": 10,
              "name": `Читальный зал`
            },
            {
              "count": 0,
              "id": 11,
              "name": `Авто`
            },
            {
              "count": 0,
              "id": 12,
              "name": `Насущные проблемы России`
            },
            {
              "count": 0,
              "id": 13,
              "name": `DIY`
            },
            {
              "count": 1,
              "id": 14,
              "name": `Робототехника`
            }
          ]
      )
  );
});


describe(`API changed category name correctly`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/category/1`)
      .send({name: `Новая категория`});
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Category name really changed`, () => request(app)
    .get(`/category/1`)
    .expect((res) => expect(res.body.name).toBe(`Новая категория`))
  );
});

describe(`API deleted category correctly`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/category/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 13 categories`, () => request(app)
    .get(`/category`)
    .expect((res) => expect(res.body.length).toBe(13))
  );
});

describe(`API created category correctly`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/category`)
      .send({name: `Новая категория`});
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns list of 14 categories`, () => request(app)
    .get(`/category`)
    .expect((res) => expect(res.body.length).toBe(14))
  );
});
