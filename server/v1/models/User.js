/**
 * This file holds all necessary queries for interacting with DB
 */

const User = {
  insertUserQuery: ` INSERT INTO
    users(firstname, lastname, email, password, registered_on)
    VALUES($1, $2, $3, $4, $5)
    returning *`,
  checkEmailQuery: 'SELECT * FROM users WHERE email = $1',
};

export default User;
