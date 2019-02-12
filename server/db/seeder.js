/* eslint-disable no-console */
import db from './index';
import { seedQueries } from './queries';

/**
 * Functions to seed necessary tables
 */
const seedTables = async () => {
  try {
    await db.query(seedQueries.usersTable);
    await db.query(seedQueries.meetupsTable);
    await db.query(seedQueries.questionsTable);
    await db.query(seedQueries.rsvpTable);
    await db.query(seedQueries.commentsTable);
    await db.query(seedQueries.votesTable);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  seedTables,
};

require('make-runnable');
