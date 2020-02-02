'use strict';

const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;
const {
  DEFAULT_PORT,
  FILE_NAME,
  HttpCode,
  Messages,
  ROOT_PAGE_PATH,
  EXIT_CODE_FAILURE,
} = require(`./constants`);

const onClientConnect = async (req, res) => {
  switch (req.url) {
    case ROOT_PAGE_PATH:
      try {
        const fileContent = await fs.readFile(FILE_NAME);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, Messages.NOT_FOUND);
      }

      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, Messages.NOT_FOUND);
      break;
  }
};

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();
  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (err) => {
        if (err) {
          console.error(Messages.SERVER_CREATION_ERROR, err);
          return process.exit(EXIT_CODE_FAILURE);
        }

        return console.info(chalk.green(`${Messages.WAITING_CONNECTION} ${port}`));
      });
  }
};
