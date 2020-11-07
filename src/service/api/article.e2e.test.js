'use strict';
const {describe, beforeAll, test, expect} = require(`@jest/globals`);

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../cli/constants`);

const mockData = require(`./mocks/mock-data-for-article`);


const createAPI = () => {
  const app = express();
  const clonedData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new DataService(clonedData), new CommentService());
  return app;
};


describe(`API returns a list of all articles`, () => {


  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
    .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 4 articles`, () => expect(response.body.length).toBe(5));

  test(`First article's id equals "8XbsMb"`, () => expect(response.body[0].id).toBe(`8XbsMb`));

});

describe(`API returns an article with given id`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
    .get(`/articles/8XbsMb`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is "Отнимут ли роботы нашу работу?"`, () => expect(response.body.title).toBe(`Отнимут ли роботы нашу работу?`));

});

describe(`API returns 404 when asked for non existed id`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
    .get(`/articles/5GIT6`);
  });

  test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));

});


describe(`API creates an article if data is valid`, () => {

  const newArticle = {
    category: [
      `Музыка`
    ],
    title: `Дам погладить котика`,
    createdDate: `2020-08-26T03:44:20.019Z`,
    announce: `Дам погладить котика. Дорого. Не гербалайф`,
    fullText: `Абсолютно невозможно не любить котиков. Даже если они не любят вас.`,
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
    .post(`/articles`)
    .send(newArticle);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));


  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );

});


describe(`API refuses to create an article if data is invalid`, () => {

  const newArticle = {
    category: [
      `Музыка`
    ],
    title: `Дам погладить котика`,
    createdDate: `2020-08-26T03:44:20.019Z`,
    announce: `Дам погладить котика. Дорого. Не гербалайф`,
    fullText: `Абсолютно невозможно не любить котиков. Даже если они не любят вас.`,
  };
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
      .post(`/articles`)
      .send(badArticle)
      .expect(HttpCode.BAD_REQUEST);
    }
  });

});

describe(`API changes existent article`, () => {

  const newArticle = {
    title: `Как начать мяукать`,
    createdDate: `2020-09-29T03:56:50.067Z`,
    announce: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция. Он написал больше 30 хитов. Достичь успеха помогут ежедневные повторения.`,
    fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой. Когда-то была профессия будильщика - по утрам специальный человек ходил и стучал палкой в окна людей. Он написал больше 30 хитов.`,
    category: [
      `Железо`,
      `Авто`,
      `Музыка`
    ]
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
    .put(`/articles/8XbsMb`)
    .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/8XbsMb`)
    .expect((res) => expect(res.body.title).toBe(`Как начать мяукать`))
  );

});


test(`API returns status code 404 when trying to change non-existent article`, () => {

  const app = createAPI();

  const validArticle = {
    category: `Это`,
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


test(`API returns status code 400 when trying to change an article with invalid data`, () => {

  const app = createAPI();

  const invalidArticle = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `статьи`,
    type: `не те поля`
  };

  return request(app)
  .put(`/articles/8XbsMb`)
  .send(invalidArticle)
  .expect(HttpCode.BAD_REQUEST);
});
describe(`API correctly deletes an article`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
    .delete(`/articles/8XbsMb`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(`8XbsMb`));

  test(`Article count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );


});

test(`API refuses to delete non-existent article`, () => {

  const app = createAPI();

  return request(app)
  .delete(`/articles/NOEXST`)
  .expect(HttpCode.NOT_FOUND);

});

describe(`API returns comments for given article id`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
    .get(`/articles/8XbsMb/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));


  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));


});

describe(`API creates a comment to existent article and returns status code 201`, () => {

  const app = createAPI();

  let response;

  const newComment = {
    text: `Комментарий`
  };

  beforeAll(async () => {
    response = await request(app)
    .post(`/articles/8XbsMb/comments`)
    .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));


  test(`Comment count is 4 now`, () => request(app)
    .get(`/articles/8XbsMb/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

});


test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {

  const app = createAPI();

  return request(app)
  .post(`/articles/NOEXST/comments`)
  .send({
    text: `Неважно`
  })
  .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {

  const app = createAPI();

  return request(app)
  .post(`/articles/8XbsMb/comments`)
  .send({})
  .expect(HttpCode.BAD_REQUEST);

});


describe(`API correctly deletes a comment`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
    .delete(`/articles/8XbsMb/comments/LuDWic`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`LuDWic`));

});


test(`API refuses to delete non-existent comment`, () => {

  const app = createAPI();

  return request(app)
  .delete(`/articles/8XbsMb/comments/NOEXST`)
  .expect(HttpCode.NOT_FOUND);

});


test(`API refuses to delete a comment to non-existent article`, () => {

  const app = createAPI();

  return request(app)
  .delete(`/articles/NOEXST/comments/LuDWic`)
  .expect(HttpCode.NOT_FOUND);

});


