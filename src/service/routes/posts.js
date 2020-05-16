'use strict';

const {Router} = require(`express`);
const fs = require(`fs`).promises;
const {
  FILE_NAME,
} = require(`./../cli/constants`);

const postsRouter = new Router();


postsRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.json([]);
  }
});

module.exports = postsRouter;
