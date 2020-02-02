'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {
  getRandomInt,
  shuffle,
} = require(`./utils`);
const {
  DEFAULT_COUNT,
  FILE_NAME,
  Messages,
  FullTextRestrict,
  AnnounceTextRestrict,
  CategoriesRestrict,
  EXIT_CODE_FAILURE,
  MAX_OFFERS_NUMBER,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
} = require(`./constants`);

const getCreatedDate = () =>{
  const currentDateTimestamp = Date.now();
  let threeMonthAgo = new Date();
  threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3);
  const threeMonthAgoTimestamp = threeMonthAgo.getTime();
  return new Date(getRandomInt(threeMonthAgoTimestamp, currentDateTimestamp));
};

const generateOffers = (count, sentences, titles, categories) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getCreatedDate(),
    announce: shuffle(sentences).slice(0, getRandomInt(FullTextRestrict.MIN, FullTextRestrict.MAX)).join(` `),
    fullText: shuffle(sentences).slice(0, getRandomInt(AnnounceTextRestrict.MIN, AnnounceTextRestrict.MAX)).join(` `),
    category: shuffle(categories).slice(0, getRandomInt(CategoriesRestrict.MIN, CategoriesRestrict.MAX)),
  }))
);

const readContent = async (filePath) => {
  try {
    const initialContent = await fs.readFile(filePath, `utf8`);
    const content = initialContent.trim();
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(`${Messages.READING_ERROR} ${filePath}`));
    return process.exit(EXIT_CODE_FAILURE);
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > MAX_OFFERS_NUMBER) {
      console.info(chalk.red(Messages.OVERMUCH));
      process.exit(EXIT_CODE_FAILURE);
    }
    const content = JSON.stringify(generateOffers(countOffer, sentences, titles, categories));
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(Messages.SUCCESS));
    } catch (error) {
      console.error(chalk.red(Messages.WRITING_ERROR));
      process.exit(EXIT_CODE_FAILURE);
    }
  }
};
