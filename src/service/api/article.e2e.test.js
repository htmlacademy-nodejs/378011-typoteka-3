'use strict';
const {describe, beforeAll, test, expect} = require(`@jest/globals`);

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../cli/constants`);

const {mockCategories, mockOffers} = require(`./mocks/mock-data-for-article`);


const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockOffers});
  const app = express();
  app.use(express.json());
  article(app, new DataService(mockDB), new CommentService(mockDB));
  return app;
};


describe(`API returns a list of all articles`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
    .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 4 articles`, () => expect(response.body.length).toBe(5));

  test(`First article's title equals "Отнимут ли роботы нашу работу?"`, () => expect(response.body[0].title).toBe(`Отнимут ли роботы нашу работу?`));

});


describe(`API returns an article with given id`, () => {


  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
    .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Отнимут ли роботы нашу работу?"`, () => expect(response.body.title).toBe(`Отнимут ли роботы нашу работу?`));

});

describe(`API returns 404 when asked for non existed id`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
    .get(`/articles/5GIT6`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));

});


describe(`API creates an article if data is valid`, () => {

  const newArticle = {
    categories: [
      1
    ],
    title: `Дам погладить котика`,
    createdDate: `2020-08-26T03:44:20.019Z`,
    announce: `Дам погладить котика. Дорого. Не гербалайф`,
    fullText: `Абсолютно невозможно не любить котиков. Даже если они не любят вас.`,
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
    .post(`/articles`)
    .send(newArticle);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));


  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );

});


describe(`API changes existent article`, () => {

  const newArticle = {
    title: `Как начать мяукать`,
    createdDate: `2020-09-29T03:56:50.067Z`,
    announce: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Достичь успеха помогут ежедневные повторения.`,
    fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой. Когда-то была профессия будильщика - по утрам специальный человек ходил и стучал палкой в окна людей. Он написал больше 30 хитов.`,
    categories: [
      1
    ]
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
    .put(`/articles/1`)
    .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/1`)
    .expect((res) => expect(res.body.title).toBe(`Как начать мяукать`))
  );

});


test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = await createAPI();

  const validArticle = {
    categories: [1],
    title: `валидный`,
    createdDate: `объект`,
    announce: `статьи`,
    fullText: `однако`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes an article`, () => {

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
    .delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));


  test(`Article count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
  .delete(`/articles/NOEXST`)
  .expect(HttpCode.NOT_FOUND);

});

describe(`API returns comments for given article id`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
    .get(`/articles/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));


  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));


});


describe(`API creates a comment to existent article and returns status code 201`, () => {

  let app; let response;

  const newComment = {
    text: `Комментарий`
  };

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
    .post(`/articles/1/comments`)
    .send(newComment);
  });

  test(`Status code 201`, async () => expect(response.statusCode).toBe(HttpCode.CREATED));


  test(`Comment count is 4 now`, async () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

});


test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
  .post(`/articles/666/comments`)
  .send({
    text: `Неважно`
  })
  .expect(HttpCode.NOT_FOUND);

});


test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {

  const app = await createAPI();
  return request(app)
    .post(`/articles/1/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);


});


describe(`API correctly deletes a comment`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
    .delete(`/articles/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

});


test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
  .delete(`/articles/1/comments/NOEXST`)
  .expect(HttpCode.NOT_FOUND);

});


test(`API refuses to delete a comment to non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
  .delete(`/articles/NOEXST/comments/1`)
  .expect(HttpCode.NOT_FOUND);

});
