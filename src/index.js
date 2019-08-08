const { port, env } = require('./constants');
const app = require('./config/express');
const logger = require('./api/utils/logger');
const chalk = require('chalk');
// var session = require('express-session');
// app.use(session({secret: 'ssshhhhh'}));

/**
 * Exports express
 * @public
 */
if (!module.parent) {
  app.listen(port, (err) => {
    if (err) {
      logger.info(chalk.red('Cannot run!'));
    } else {
      logger.info(chalk.green(`
        \n
        App started on port: ${port}
        Env: ${env}`));
    }
  });
}

module.exports = app;
