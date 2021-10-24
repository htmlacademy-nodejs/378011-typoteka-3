'use strict';

const convertErrors = (errorList, errorType)=> {
  const neededError = errorList.find((it)=> it[0] === errorType);
  return neededError && neededError[1];
};


module.exports = {
  convertErrors,
};
