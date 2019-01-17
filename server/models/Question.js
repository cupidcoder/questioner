/**
 * Question model that holds the queries for question actions
 */

const Question = {
  insertQuestionQuery: ` INSERT INTO
    questions(created_on, user_id, meetup_id, title, body)
    VALUES($1, $2, $3, $4, $5)
    returning *`,
};

export default Question;
