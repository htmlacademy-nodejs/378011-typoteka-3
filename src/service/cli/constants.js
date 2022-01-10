'use strict';

const DEFAULT_COUNT = 1;

const FILE_NAME = `mocks.json`;

const HELP = `Программа запускает http-сервер и формирует файл с данными для API.

    Гайд:
    server -- <command>;
    Команды:
    --version:            выводит номер версии
    --help:               печатает этот текст
    --filldb <count>      заполняет базу данными`;

const USER_ARGV_INDEX = 2;

const DEFAULT_COMMAND = `--help`;

const MAX_ARTICLES_NUMBER = 1000;

const MAX_ID_LENGTH = 6;

const AnnounceTextRestrict = {
  MIN: 1,
  MAX: 5,
};

const FullTextRestrict = {
  MIN: 1,
  MAX: 20,
};

const CategoriesRestrict = {
  MIN: 1,
  MAX: 3,
};

const TextRestrict = {
  MIN: 1,
  MAX: 3,
};

const CommentsRestrict = {
  MIN: 1,
  MAX: 4,
};

const PictureRestrict = {
  MIN: 0,
  MAX: 3,
};

const Messages = {
  WRITING_ERROR: `Can't write data to file...`,
  READING_ERROR: `Can't read data from file`,
  SUCCESS: `Operation success. File created.`,
  OVERMUCH: `Не больше 1000 публикаций`,
  NOT_FOUND: `Not found`,
  SERVER_CREATION_ERROR: `Ошибка при создании сервера`,
  WAITING_CONNECTION: `Ожидаю соединений на`,
};

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const FILE_USERS_PATH = `./data/users.txt`;
const FILE_EMAILS_PATH = `./data/emails.txt`;
const FILE_AVATARS_PATH = `./data/avatars.txt`;
const FILE_PICTURES_PATH = `./data/pictures.txt`;

const DEFAULT_PORT = 3000;

const ROOT_PAGE_PATH = `/`;

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const ExitCode = {
  SUCCESS: 0,
  FAIL: 1
};

const API_PREFIX = `/api`;

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const FILL_DB_FILE = `./fill-db.sql`;

const SALT_ROUNDS = 10;

const UserRole = {
  admin: `admin`,
  member: `member`,
};

const PoolParameter = {
  MAX: 5,
  MIN: 0,
  ACQUIRE: 10000,
  IDLE: 10000
};

module.exports = {
  DEFAULT_COUNT,
  FILE_NAME,
  HELP,
  USER_ARGV_INDEX,
  DEFAULT_COMMAND,
  MAX_ARTICLES_NUMBER,
  AnnounceTextRestrict,
  FullTextRestrict,
  CategoriesRestrict,
  ExitCode,
  Messages,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_USERS_PATH,
  FILE_EMAILS_PATH,
  FILE_AVATARS_PATH,
  FILE_PICTURES_PATH,
  FILL_DB_FILE,
  DEFAULT_PORT,
  ROOT_PAGE_PATH,
  HttpCode,
  MAX_ID_LENGTH,
  FILE_COMMENTS_PATH,
  CommentsRestrict,
  TextRestrict,
  API_PREFIX,
  Env,
  PictureRestrict,
  SALT_ROUNDS,
  UserRole,
  PoolParameter,
};
