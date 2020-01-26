'use strict';

const {Cli} = require(`./cli/index`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ExitCode,
  Messages,
  MAX_OFFERS_NUMBER,
} = require(`./cli/constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.success);
}
const offersNumber = userArguments.slice(1);

if (offersNumber > MAX_OFFERS_NUMBER) {
  console.info(Messages.overmuch);
  process.exit(ExitCode.failure);
}
Cli[userCommand].run(offersNumber);
