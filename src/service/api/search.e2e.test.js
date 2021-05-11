'use strict';
const {describe, beforeAll, test, expect} = require(`@jest/globals`);

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../cli/constants`);

const {mockCategories, mockOffers} = require(`./mocks/mock-data-for-search`);
const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockOffers});
  search(app, new DataService(mockDB));
});

describe(`API returns offer based on search query`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
    .get(`/search`)
    .query({
      query: `Сколько людей на самом деле живет в Китае?`
    });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 article found`, () => expect(response.body.length).toBe(1));
  test(`Offer has correct title`, () => expect(response.body[0].title).toBe(`Сколько людей на самом деле живет в Китае?`));
});

test(`API returns code 404 if nothing is found`,
    () => request(app)
  .get(`/search`)
  .query({
    query: `Продам свою душу`
  })
  .expect(HttpCode.NOT_FOUND)
);

test(`API returns 400 when query string is absent`,
    () => request(app)
  .get(`/search`)
  .expect(HttpCode.BAD_REQUEST)
);
