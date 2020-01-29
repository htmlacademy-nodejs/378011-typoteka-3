'use strict';

const chalk = require(`chalk`);
const {
  HELP,
} = require(`./constants`);

module.exports = {
  name: `--help`,
  run() {
    console.info(chalk.grey(HELP));
  }
};
