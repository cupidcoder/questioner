import APIResponse from '../helpers/Response';
import StatusCodes from '../helpers/status';
import db from '../../db/index';
import CommentModel from '../models/Comment';
/**
 * Comment controller performs endpoint actions for comments
 */

const Comment = {
  /**
   * Sign up a comment
   * @param {object} req
   * @param {object} res
   * @returns {object} commentObject
   */
  // eslint-disable-next-line consistent-return
  async create(req, res) {
    const response = new APIResponse();
    const comment = req.body;
    try {
      const result = await db.query(CommentModel.insertCommentQuery, [
        comment.comment, req.user.id, comment.questionID]);
      if (result.rowCount > 0) {
        response.setSuccess(StatusCodes.created, result.rows[0]);
        return response.send(res);
      }
    } catch (error) {
      response.setFailure(StatusCodes.unavailable, 'Some error occurred. Please try again');
      return response.send(res);
    }
  },
};

export default Comment;
