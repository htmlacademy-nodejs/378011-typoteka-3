'use strict';

const DEFAULT_PORT = 8080;

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const ARTICLES_PER_PAGE = 8;

const ArticlesNumberRestrict = {
  FIRST: 0,
  LAST: 4,
};

const CommentsNumberRestrict = {
  FIRST: 0,
  LAST: 4,
};

const UserRole = {
  admin: `admin`,
  member: `member`,
};

const SECRET = `verysecretstring`;

module.exports = {
  DEFAULT_PORT,
  HttpCode,
  HttpMethod,
  ARTICLES_PER_PAGE,
  ArticlesNumberRestrict,
  CommentsNumberRestrict,
  UserRole,
  SECRET,
};
