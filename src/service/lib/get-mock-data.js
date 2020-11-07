'use strict';
const fs = require(`fs`).promises;
const {
  FILE_NAME,
} = require(`./../cli/constants`);
const {getLogger} = require(`../lib/logger`);


let data = null;
const logger = getLogger({name: `api`});

const getMockData = async () => {
  if (data !== null) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(FILE_NAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    logger.error(err);
    return err;
  }

  return data;
};

module.exports = getMockData;
