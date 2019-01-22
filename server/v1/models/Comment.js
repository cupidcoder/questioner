/**
 * Comment model that holds the queries for comment actions
 */

const Comment = {
  insertCommentQuery: ` INSERT INTO
    comments(comment, user_id, question_id)
    VALUES($1, $2, $3)
    returning *`,
};

export default Comment;
