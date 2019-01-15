/* eslint-disable no-console */
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
 * Functions to create necessary tables
 */
const createUserTables = () => {
  pool.query(createQueries.usersTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createMeetupTables = () => {
  pool.query(createQueries.meetupsTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createQuestionsTable = () => {
  pool.query(createQueries.questionsTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createRSVPTable = () => {
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

const createCommentsTable = () => {
  pool.query(createQueries.commentsTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createVotesTable = () => {
  pool.query(createQueries.votesTable)
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
 * Functions for dropping Tables
 */

const dropUserTable = () => {
  pool.query(dropQueries.usersTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropMeetupsTable = () => {
  pool.query(dropQueries.meetupsTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropQuestionsTable = () => {
  pool.query(dropQueries.questionsTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropRSVPTable = () => {
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

const dropCommentsTable = () => {
  pool.query(dropQueries.commentsTable)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropVotesTable = () => {
  pool.query(dropQueries.votesTable)
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
 * Creates the necessary tables in the database
 */
const createTables = () => {
  createUserTables();
  createMeetupTables();
  createQuestionsTable();
  createRSVPTable();
  createCommentsTable();
  createVotesTable();
};


/**
 * Drops the necessary tables in the database
 */
const dropTables = () => {
  dropUserTable();
  dropMeetupsTable();
  dropQuestionsTable();
  dropRSVPTable();
  dropCommentsTable();
  dropVotesTable();
};

pool.on('remove', () => {
  process.exit(0);
});

module.exports = {
  createTables,
  dropTables,
};

require('make-runnable');
