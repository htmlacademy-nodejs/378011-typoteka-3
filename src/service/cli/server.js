'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const routes = require(`../api`);
const getMockData = require(`../lib/get-mock-data`);

const {
  DEFAULT_PORT,
  HttpCode,
  API_PREFIX,
} = require(`./constants`);

const app = express();
app.use(express.json());
app.use(API_PREFIX, routes);


app.use((req, res) => res
.status(HttpCode.NOT_FOUND)
.send(`Not found`));

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    try {
      await getMockData();
      app.listen(port, (err) => {
        if (err) {
          return console.error(`Ошибка при создании сервера`, err);
        }
        return console.info(chalk.green(`Ожидаю соединений на ${port}`));
      });
    } catch (err) {
      console.error(`Произошла ошибка: ${err.message}`);
      process.exit(1);
    }
  }
};