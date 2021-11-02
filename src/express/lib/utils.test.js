'use strict';

const {describe, test, expect} = require(`@jest/globals`);


const {findErrorTextByType} = require(`./utils`);

describe(`findErrorTextByType: title error`, () => {
  const parsedError = [[`title`, `Заголовок содержит меньше 30 символов`]];
  const errorType = `title`;
  const correctResult = `Заголовок содержит меньше 30 символов`;
  const currentResult = findErrorTextByType(parsedError, errorType);
  test(`title error Заголовок содержит меньше 30 символов`, () => expect(currentResult).toBe(correctResult));
});

describe(`findErrorTextByType: title with announce and categories error`, () => {
  const parsedError = [
    [`title`, `Заголовок содержит меньше 30 символов`],
    [`announce`, `Анонс содержит меньше 30 символов`],
    [`categories`, `Не выбрана ни одна категория объявления`]
  ];
  const errorType = `title`;
  const correctResult = `Заголовок содержит меньше 30 символов`;
  const currentResult = findErrorTextByType(parsedError, errorType);
  test(`get title error Заголовок содержит меньше 30 символов`, () => expect(currentResult).toBe(correctResult));
});

describe(`findErrorTextByType: announce with title and categories error`, () => {
  const parsedError = [
    [`title`, `Заголовок содержит меньше 30 символов`],
    [`announce`, `Анонс содержит меньше 30 символов`],
    [`categories`, `Не выбрана ни одна категория объявления`]
  ];
  const errorType = `announce`;
  const correctResult = `Анонс содержит меньше 30 символов`;
  const currentResult = findErrorTextByType(parsedError, errorType);
  test(`get announce error Анонс содержит меньше 30 символов`, () => expect(currentResult).toBe(correctResult));
});

describe(`findErrorTextByType: no announce error with title error`, () => {
  const parsedError = [[`title`, `Заголовок содержит меньше 30 символов`]];
  const errorType = `announce`;
  const correctResult = null;
  const currentResult = findErrorTextByType(parsedError, errorType);
  test(`title error Заголовок содержит меньше 30 символов`, () => expect(currentResult).toBe(correctResult));
});
