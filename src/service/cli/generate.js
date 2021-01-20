'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const {
  getRandomInt,
  shuffle,
  getCreatedDate,
  readContent,
} = require(`./utils`);
const {
  DEFAULT_COUNT,
  FILE_NAME,
  Messages,
  FullTextRestrict,
  AnnounceTextRestrict,
  CategoriesRestrict,
  EXIT_CODE_FAILURE,
  MAX_ARTICLES_NUMBER,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  MAX_ID_LENGTH,
  FILE_COMMENTS_PATH,
  TextRestrict,
  CommentsRestrict,
} = require(`./constants`);

const generateComments = (count, comments)=>{
  return Array(count).fill({}).map(()=>{
    return {
      id: nanoid(MAX_ID_LENGTH),
      text: shuffle(comments).slice(0, getRandomInt(TextRestrict.MIN, TextRestrict.MAX)).join(` `),
    };
  });
};

const generateArticles = (count, sentences, titles, categories, comments) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getCreatedDate(),
    announce: shuffle(sentences).slice(0, getRandomInt(AnnounceTextRestrict.MIN, AnnounceTextRestrict.MAX)).join(` `),
    fullText: shuffle(sentences).slice(0, getRandomInt(FullTextRestrict.MIN, FullTextRestrict.MAX)).join(` `),
    category: shuffle(categories).slice(0, getRandomInt(CategoriesRestrict.MIN, CategoriesRestrict.MAX)),
    id: nanoid(MAX_ID_LENGTH),
    comments: generateComments(getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX), comments),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countArticle > MAX_ARTICLES_NUMBER) {
      console.info(chalk.red(Messages.OVERMUCH));
      process.exit(EXIT_CODE_FAILURE);
    }
    const content = JSON.stringify(generateArticles(countArticle, sentences, titles, categories, comments));
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(Messages.SUCCESS));
    } catch (error) {
      console.error(chalk.red(Messages.WRITING_ERROR));
      process.exit(EXIT_CODE_FAILURE);
    }
  }
};
