'use strict';
const dayjs = require(`dayjs`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {
  Messages,
  ExitCode,
} = require(`./constants`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getCreatedDate = () =>{
  const currentDateTimestamp = Date.now();
  const threeMonthAgo = new Date();
  threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3);
  const threeMonthAgoTimestamp = threeMonthAgo.getTime();
  return dayjs(new Date(getRandomInt(threeMonthAgoTimestamp, currentDateTimestamp))).format(`YYYY-MM-DD`);
};

const readContent = async (filePath) => {
  try {
    const initialContent = await fs.readFile(filePath, `utf8`);
    const content = initialContent.trim();
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(`${Messages.READING_ERROR} ${filePath}`));
    return process.exit(ExitCode.FAIL);
  }
};

const getRandomNull = () => {
  if (Math.floor(Math.random() * (2))) {
    return true;
  }
  return null;
};

const ensureArray = (value) => Array.isArray(value) ? value : [value];

module.exports = {
  getRandomInt,
  shuffle,
  getCreatedDate,
  readContent,
  getRandomNull,
  ensureArray,
};
