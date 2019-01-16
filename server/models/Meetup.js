/**
 * Meetup model that holds the queries for meetup actions
 */

const Meetup = {
  insertMeetupQuery: ` INSERT INTO
    meetups(location, created_on, topic, happening_on)
    VALUES($1, $2, $3, $4)
    returning *`,

  getAllQuery: 'SELECT * FROM meetups',
};

export default Meetup;
