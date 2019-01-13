const { Pool } = require('pg');

const dotenv = require('dotenv');

const { createQueries, dropQueries } = require('./queries');


dotenv.config();

const dbString = process.env.NODE_ENV === 'development' ? process.env.DATABASE_URL : process.env.TEST_DATABASE_URL;

const pool = new Pool({
  connectionString: dbString,
});

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Creates the necessary tables in the database
 */
const createTables = () => {
  pool.query(createQueries.usersTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });

  pool.query(createQueries.meetupsTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });

  pool.query(createQueries.questionsTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });

  pool.query(createQueries.rsvpTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};


/**
 * Drops the necessary tables in the database
 */
const dropTables = () => {
  pool.query(dropQueries.usersTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });

  pool.query(dropQueries.meetupsTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });

  pool.query(dropQueries.questionsTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });

  pool.query(dropQueries.rsvpTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createTables,
  dropTables,
};

require('make-runnable');
