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
        response.setSuccess(StatusCodes.created, 'Your comment has been submitted', result.rows[0]);
        return response.send(res);
      }
    } catch (error) {
      response.setFailure(StatusCodes.unavailable, 'Some error occurred. Please try again');
      return response.send(res);
    }
  },

  /**
   * Delete a comment
   * @param {object} req
   * @param {object} res
   * @returns {object} API response
   */
  async delete(req, res) {
    const response = new APIResponse();
    try {
      const { rows } = await db.query(CommentModel.getOneQuery, [req.params.id]);
      if (rows.length === 0) {
        response.setFailure(StatusCodes.forbidden, 'Comment does not exist');
        return response.send(res);
      }
      // User has to be comment owner or admin
      if ((req.user.id === rows[0].user_id) || req.user.isAdmin) {
        const { rowCount } = await db.query(CommentModel.deleteOneQuery, [req.params.id]);
        if (rowCount > 0) {
          response.setSuccess(StatusCodes.success, 'Comment deleted successfully');
          return response.send(res);
        }
      }

      response.setFailure(StatusCodes.unauthorized, 'Only admin and comment owner can delete comment');
      return response.send(res);
    } catch (error) {
      response.setFailure(StatusCodes.unavailable, 'Some error occurred');
      return response.send(res);
    }
  },
};

export default Comment;
