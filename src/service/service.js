'use strict';

const {Cli} = require(`./cli/index`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
} = require(`./cli/constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
} else {
  const offersNumber = userArguments.slice(1);
  Cli[userCommand].run(offersNumber);
}
