/**
 * Vote model that holds the queries for vote actions
 */

const Vote = {
  insertQuestionVote: `INSERT INTO
    votes(up , down, user_id, question_id)
    VALUES($1, $2, $3, $4)
    `,
  getTotalVotesQuery: 'SELECT COUNT(*) AS votes from votes WHERE question_id=$1',
  getDOWNVotesQuery: 'SELECT COUNT(*) AS votes from votes WHERE down=true AND question_id=$1',
  getUserVoteQuery: 'SELECT * FROM votes WHERE user_id=$1 AND question_id=$2',
  updateUserVoteQuery: 'UPDATE votes SET up=$1, down=$2 WHERE user_id=$3 AND question_id=$4',
};

export default Vote;
