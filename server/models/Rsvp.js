/**
 * RSVP model that holds the queries for rsvp actions
 */

const Rsvp = {
  insertRSVPQuery: `
    INSERT INTO rsvp(user_id, meetup_id, response)
    VALUES($1, $2, $3)
  `,
};


export default Rsvp;
