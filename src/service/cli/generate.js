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
  TITLES,
  SENTENCES,
  CATEGORIES,
  Messages,
  FullTextRestrict,
  AnnonceTextRestrict,
  EXIT_CODE_FAILURE,
  MAX_OFFERS_NUMBER,
} = require(`./constants`);

const getCreatedDate = () =>{
  const currentDateTimestamp = Date.now();
  let threeMonthAgo = new Date();
  threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3);
  const threeMonthAgoTimestamp = threeMonthAgo.getTime();
  return new Date(getRandomInt(threeMonthAgoTimestamp, currentDateTimestamp));
};

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    createdDate: getCreatedDate(),
    announce: shuffle(SENTENCES).slice(0, getRandomInt(FullTextRestrict.min, FullTextRestrict.max)).join(` `),
    fullText: shuffle(SENTENCES).slice(0, getRandomInt(AnnonceTextRestrict.min, AnnonceTextRestrict.max)).join(` `),
    categories: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]],
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    if (countOffer > MAX_OFFERS_NUMBER) {
      console.info(chalk.red(Messages.overmuch));
      process.exit(EXIT_CODE_FAILURE);
    }
    const content = JSON.stringify(generateOffers(countOffer));
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(Messages.success));
    } catch (error) {
      console.error(chalk.red(Messages.error));
      process.exit(EXIT_CODE_FAILURE);
    }
  }
};
