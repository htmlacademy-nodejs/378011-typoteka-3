'use strict';

const mockUsers = [
  {
    name: `Иван Иванов`,
    email: `ivanov@example.com`,
    passwordHash: `$2b$10$69SrwAoAUNC5F.gtLEvrNON6VQ5EX89vNqLEqU655Oy9PeT/HRM/a`,
    avatar: `avatar01.jpg`,
    role: `admin`,
  },
  {
    name: `Пётр Петров`,
    email: `petrov@example.com`,
    passwordHash: `$2b$10$//TYiVVE59p7G5k/4Klx/ezF7BI42QZKmoGGGvUuqxRE5bFFBLy`,
    avatar: `avatar02.jpg`,
    role: `member`
  }
];


module.exports = {
  mockUsers
};
