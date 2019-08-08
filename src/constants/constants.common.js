require('dotenv').config();
/**
 * This trick will get the intellisense to pick up
 * the dynamically defined constants.
 * We do not require any value here, just the shape of the object.
 * Do not worry about the values as they will be overridden by the
 * constnat.[env].js variables
 */

const shape = {
  logs: undefined,
  corsOptions: {
    origin: undefined,
    credentials: undefined,
  }
};

/**
 * Common constants across all the enviromnents (dev, staging, prod)
 */
module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  dbConfig: {
    "database": process.env.DB_NAME,
    "user": process.env.DB_USERNAME, 
    "password":  process.env.DB_PASSWORD, 
    "host": process.env.DB_URI, 
    "connectionLimit": 10,
    "port" : process.env.DB_PORT
  },

  dump: {
    secret: process.env.DUMP_SECRET,
  },

  ...shape,
};




// DB_USERNAME=root
// DB_PASSWORD=root1234  
// DB_URI=localhost
// DB_NAME=mtix
// DB_PORT=3306