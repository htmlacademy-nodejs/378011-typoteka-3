'use strict';
const {
  HELP,
} = require(`./constants`);

module.exports = {
  name: `--help`,
  run() {
    console.info(HELP);
  }
};
