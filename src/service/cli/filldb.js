'use strict';

const fs = require(`fs`).promises;
const {
  getRandomInt,
  shuffle,
  getRandomNull,
} = require(`./utils`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);

const {
  DEFAULT_COUNT,
  Messages,
  FullTextRestrict,
  AnnounceTextRestrict,
  EXIT_CODE_FAILURE,
  MAX_ARTICLES_NUMBER,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_PICTURES_PATH,
  PictureRestrict,
  FILE_COMMENTS_PATH,
  TextRestrict,
  CommentsRestrict,
  CategoriesRestrict,
} = require(`./constants`);

const logger = getLogger({});

const readContent = async (filePath) => {
  try {
    const initialContent = await fs.readFile(filePath, `utf8`);
    const content = initialContent.trim();
    return content.split(`\n`);
  } catch (err) {
    logger.error(`${Messages.READING_ERROR} ${filePath}`);
    return process.exit(EXIT_CODE_FAILURE);
  }
};

const generateComments = (count, comments, users)=>{
  return Array(count).fill({}).map(()=>{
    return {
      text: shuffle(comments).slice(0, getRandomInt(TextRestrict.MIN, TextRestrict.MAX)).join(` `),
      user: users[getRandomInt(0, users.length - 1)].email,
    };
  });
};

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(CategoriesRestrict.MIN, CategoriesRestrict.MAX);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const getPictureFileName = (pictures, number) => getRandomNull() && `${pictures[number]}`;


const generateArticles = (count, sentences, titles, categories, comments, users, pictures) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(0, getRandomInt(AnnounceTextRestrict.MIN, AnnounceTextRestrict.MAX)).join(` `),
    fullText: getRandomNull() && shuffle(sentences).slice(0, getRandomInt(FullTextRestrict.MIN, FullTextRestrict.MAX)).join(` `),
    picture: getPictureFileName(pictures, getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    categories: getRandomSubarray(categories),
    comments: generateComments(getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX), comments, users),
    user: users[getRandomInt(0, users.length - 1)].email,
  }))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(EXIT_CODE_FAILURE);
    }
    logger.info(`Connection to database established`);

    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);
    const pictures = await readContent(FILE_PICTURES_PATH);
    const users = [
      {
        name: `Иван Иванов`,
        email: `ivanov@example.com`,
        passwordHash: await passwordUtils.hash(`ivanov`),
        avatar: `avatar-1.png`,
        role: `admin`
      },
      {
        name: `Пётр Петров`,
        email: `petrov@example.com`,
        passwordHash: await passwordUtils.hash(`petrov`),
        avatar: `avatar-2.png`,
        role: `member`
      }
    ];


    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countArticle > MAX_ARTICLES_NUMBER) {
      console.info(logger.error(Messages.OVERMUCH));
      process.exit(EXIT_CODE_FAILURE);
    }

    const articles = generateArticles(countArticle, sentences, titles, categories, comments, users, pictures);

    initDatabase(sequelize, {articles, categories, users});


  }
};
