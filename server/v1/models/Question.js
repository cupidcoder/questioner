/**
 * Question model that holds the queries for question actions
 */

const Question = {
  insertQuestionQuery: ` INSERT INTO
    questions(created_on, user_id, meetup_id, body)
    VALUES($1, $2, $3, $4)
    returning *`,
  getOneQuery: 'SELECT * FROM questions WHERE id = $1',
  deleteOneQuery: 'DELETE FROM questions WHERE id = $1',
  getCommentsQuery: 'SELECT * FROM comments WHERE question_id = $1',
};

export default Question;
