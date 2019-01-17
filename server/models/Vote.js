/**
 * Vote model that holds the queries for vote actions
 */

const Vote = {
  insertQuestionVote: `INSERT INTO
    votes(up , down, user_id, question_id)
    VALUES($1, $2, $3, $4)
    `,
  getUPVotesQuery: 'SELECT COUNT(up) AS votes from votes WHERE up=true AND question_id=$1',
  getDOWNVotesQuery: 'SELECT COUNT(down) AS votes from votes WHERE down=true AND question_id=$1',
};

export default Vote;
