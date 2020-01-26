'use strict';

const fs = require(`fs`);
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
    category: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]],
  }))
);

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateOffers(countOffer));
    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        return console.error(Messages.error);
      }

      return console.info(Messages.success);
    });
  }
};
