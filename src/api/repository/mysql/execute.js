const logger = require('../../utils/logger');
const mysql = require('mysql2');

let _pool = null;

const setConnectionPool = (pool) => {
  _pool = pool;
};

const executeQuery = async (query) => {
  // logger.info('Executing query: ', query);
  try {
    const promisePool = await _pool.promise();
    const [rows, fields] = await promisePool.query(query);
    return rows;
  } catch (e) {
    logger.info('Error in executing DB query:');
    logger.info(e);
    const modifiedError = Object.assign(e, { databaseStatus: 0 });
    throw modifiedError;
  }
};

module.exports = { executeQuery, setConnectionPool };
