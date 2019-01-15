import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbString = process.env.NODE_ENV === 'development' ? process.env.DATABASE_URL : process.env.TEST_DATABASE_URL;

const pool = new Pool({
  connectionString: dbString,
});

export default {
  /**
   * DB Query
   * @param {string} SQL query
   * @returns {object} object
   */
  query(sqlQuery) {
    return new Promise((resolve, reject) => {
      pool.query(sqlQuery)
        .then((res) => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  },
};
