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
   * @param {string} query
   * @param {Array} placeholder values
   * @returns {object} object
   */
  query(sqlQuery, values) {
    return new Promise((resolve, reject) => {
      pool.query(sqlQuery, values)
        .then((res) => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  },
};
