/* eslint-disable no-console */
const { Pool } = require('pg');

const dotenv = require('dotenv');

const { seedQueries } = require('./queries');


dotenv.config();

const dbString = process.env.NODE_ENV === 'development' ? process.env.DATABASE_URL : process.env.TEST_DATABASE_URL;

const pool = new Pool({
  connectionString: dbString,
});

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Functions to seed necessary tables
 */
const seedUserTables = () => {
  pool.query(seedQueries.usersTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const seedMeetupTables = () => {
  pool.query(seedQueries.meetupsTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const seedQuestionsTables = () => {
  pool.query(seedQueries.questionsTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const seedRSVPTables = () => {
  pool.query(seedQueries.rsvpTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const seedCommentsTables = () => {
  pool.query(seedQueries.commentsTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const seedVotesTables = () => {
  pool.query(seedQueries.votesTable)
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
 * Runs all seeders
 */

const run = () => {
  seedUserTables();
  seedMeetupTables();
  seedQuestionsTables();
  seedRSVPTables();
  seedCommentsTables();
  seedVotesTables();
};

pool.on('remove', () => {
  process.exit(0);
});

module.exports = {
  run,
};

require('make-runnable');
