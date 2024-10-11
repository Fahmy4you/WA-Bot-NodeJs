const getTime = require("./getTime");

module.exports = (type, info, message) => {
  const time = getTime();
  switch (type) {
    case "error":
      console.log(
        `\n\x1b[1m\x1b[41m Fahmy❀4You『BOT』父 \x1b[0m\x20\x20${time}`,
        `\n\x1b[1m\x1b[31m${info}\x1b[0m :`,
        message
      );
      break;
    case "warning":
      console.log(
        `\n\x1b[1m\x1b[43m\x1b[30m Fahmy❀4You『BOT』父 \x1b[0m\x20\x20${time}`,
        `\n\x1b[1m\x1b[33m${info}\x1b[0m :`,
        message
      );
      break;
    case "success":
      console.log(
        `\n\x1b[1m\x1b[42m\x1b[30m Fahmy❀4You『BOT』父 \x1b[0m\x20\x20${time}`,
        `\n\x1b[1m\x1b[32m${info}\x1b[0m :`,
        message
      );
      break;
    case "info":
      console.log(
        `\n\x1b[1m\x1b[46m\x1b[30m Fahmy❀4You『BOT』父 \x1b[0m\x20\x20${time}`,
        `\n\x1b[1m\x1b[36m${info}\x1b[0m :`,
        message
      );
      break;

    default:
      console.log(
        `\n\x1b[1m\x1b[45m Fahmy❀4You『BOT』父 \x1b[0m\x20\x20${time}`,
        `\n\x1b[1m\x1b[35m${info}\x1b[0m :`,
        message
      );
      break;
  }
  return;
};
