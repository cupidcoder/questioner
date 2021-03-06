/**
 * Meetup model that holds the queries for meetup actions
 */

const Meetup = {
  insertMeetupQuery: ` INSERT INTO
    meetups(location, created_on, topic, description, happening_on)
    VALUES($1, $2, $3, $4, $5)
    returning *`,

  getAllQuery: 'SELECT * FROM meetups',

  getUpcomingQuery: 'SELECT * FROM meetups WHERE happening_on >= current_timestamp ORDER BY happening_on ASC',

  getOneQuery: 'SELECT * FROM meetups where id = $1',

  deleteMeetup: 'DELETE FROM meetups where id = $1',

  updateTags: 'UPDATE meetups set tags = $2 where id = $1 returning *',

  updateImagesQuery: 'UPDATE meetups set images = $2 where id = $1 returning *',

  getQuestionsQuery: 'SELECT * FROM questions WHERE meetup_id = $1',
};

export default Meetup;
