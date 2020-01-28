'use strict';

const {Cli} = require(`./cli/index`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  EXIT_CODE_FAILURE,
  Messages,
  MAX_OFFERS_NUMBER,
  GENERATE_COMMAND,
} = require(`./cli/constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
} else {
  const offersNumber = userArguments.slice(1);
  Cli[userCommand].run(offersNumber);
}
