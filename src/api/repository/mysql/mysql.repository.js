const sql = require('mysql2');

const { executeQuery, setConnectionPool } = require('./execute');
const constants = require('../../../constants/constants.common');
const logger = require('../../utils/logger');

const { dbConfig } = constants;

// Holds the current connection in a pool object
let pool = null;

/**
 * Opens the connection to database and saves the connection in 'pool' variable.
 */
const connect = async () => {
  try {
    console.log(dbConfig);
    pool = await sql.createPool(dbConfig);
    logger.info('SQL server connection opened successfully.');
    return;
  } catch (e) {
    logger.info('Error connecting to SQL server.');
    throw e;
  }
};

// Asynchronously open the connection
(async () => {
  try {
    await connect();
    setConnectionPool(pool);
  } catch (e) {
    logger.error(`[${e.name}] [${e.errorLabels.join(', ')}] ${e.message}`);
  }
})();

module.exports = {
  executeQuery,
};
