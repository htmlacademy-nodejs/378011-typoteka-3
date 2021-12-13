'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const routes = require(`../api`);
const portfinder = require(`portfinder`);

const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const http = require(`http`);
const socket = require(`../lib/socket`);

const {
  DEFAULT_PORT,
  HttpCode,
  API_PREFIX,
} = require(`./constants`);

const app = express();
const server = http.createServer(app);

const io = socket(server);
app.locals.socketio = io;


const logger = getLogger({name: `api`});

app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND)
  .send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occured on processing request: ${err.message}`);
});


module.exports = {
  name: `--server`,

  async run(args) {
    const [customPort] = args;
    const selectedPort = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    process.env.API_PORT = selectedPort;
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);
    portfinder.basePort = selectedPort;
    portfinder.highestPort = selectedPort;

    portfinder.getPortPromise()
      .then((port) => {
        server.listen(port, (err) => {
          if (err) {
            return logger.error(`Ошибка при создании сервера`, err);
          }
          return logger.info(chalk.green(`Ожидаю соединений на ${port}`));
        });
      })
      .catch((err) => {
        logger.error(`Произошла ошибка: ${err.message === `No open ports available` ? `Порт ${selectedPort} занят` : err.message}`);
        process.exit(1);
      });

  }
};
