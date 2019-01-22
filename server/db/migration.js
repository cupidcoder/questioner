/* eslint-disable no-console */
import db from './index';
import { createQueries, dropQueries } from './queries';

/**
 * Function to create necessary tables
 */
const createTables = async () => {
  try {
    await db.query(createQueries.usersTable);
    await db.query(createQueries.meetupsTable);
    await db.query(createQueries.questionsTable);
    await db.query(createQueries.rsvpTable);
    await db.query(createQueries.commentsTable);
    await db.query(createQueries.votesTable);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Function for dropping Tables
 */

const dropTables = async () => {
  try {
    await db.query(dropQueries.usersTable);
    await db.query(dropQueries.meetupsTable);
    await db.query(dropQueries.questionsTable);
    await db.query(dropQueries.commentsTable);
    await db.query(dropQueries.rsvpTable);
    await db.query(dropQueries.votesTable);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createTables,
  dropTables,
};

require('make-runnable');
