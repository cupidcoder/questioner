/* eslint-disable consistent-return */
import db from '../../db/index';
import QuestionModels from '../models/Question';
import VoteModels from '../models/Vote';
import statusCodes from '../helpers/status';
import APIResponse from '../helpers/Response';
import MeetupController from './Meetup';

/**
 * Question controller performs different actions for the question entity
 *
 */

const Question = {
  /**
   * Change user question vote (upvote to downvote and vice-versa)
   * @param {*} values
   * @param {*} res
   * @param {*} type
   */
  async changeVote(values, res, type) {
    const response = new APIResponse();
    const { rows } = await db.query(VoteModels.getUserVoteQuery, [values[2], values[3]]);
    if (type === 'upvote') {
      if (rows[0].up === true) {
        // User is trying to upvote again
        response.setFailure(statusCodes.forbidden, 'Your vote has already been recorded');
        return response.send(res);
      }
      // At this point, User is trying to change downvote to upvote
      const { rowCount } = await db.query(VoteModels.updateUserVoteQuery,
        [true, false, values[2], values[3]]);
      return rowCount;
    }
    // Here, this is a downvote request
    if (rows[0].down === true) {
      // User is trying to downvote again
      response.setFailure(statusCodes.forbidden, 'Your vote has already been recorded');
      return response.send(res);
    }
    // At this point, User is trying to change upvote to downvote
    const { rowCount } = await db.query(VoteModels.updateUserVoteQuery,
      [false, true, values[2], values[3]]);
    return rowCount;
  },

  /**
   * Upvote or downvote a question
   * @param {string} type
   * @param {array} values
   * @param {object} res
   * @returns {int} rowCount
   */
  async castVote(values, res, type = 'upvote') {
    const response = new APIResponse();
    try {
      const { rowCount } = await db.query(VoteModels.insertQuestionVote, values);
      return rowCount;
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        // At this point, user wants to change vote
        try {
          const rowCount = Question.changeVote(values, res, type);
          return rowCount;
        } catch (InnerError) {
          response.setFailure(statusCodes.unavailable, 'Some error occurred. Please try again');
          return response.send(res);
        }
      }
      response.setFailure(statusCodes.unavailable, 'Some error occurred. Please try again');
      return response.send(res);
    }
  },

  /**
   * Get vote count for a particular question
   * @param {int} questionID
   * @param {object} res
   * @returns {int} voteCount
   */
  async getVoteCount(questionID, res) {
    const response = new APIResponse();
    try {
      const totalVotes = await db.query(VoteModels.getTotalVotesQuery, [questionID]);
      const downs = await db.query(VoteModels.getDOWNVotesQuery, [questionID]);
      const voteCount = ((totalVotes.rows[0].votes - downs.rows[0].votes) < 0)
        ? 0 : totalVotes.rows[0].votes - downs.rows[0].votes;
      return voteCount;
    } catch (error) {
      response.setFailure(statusCodes.unavailable, 'An error occurred. Please try again.');
      return response.send(res);
    }
  },

  /**
   * Creates a question record
   * @param {object} req
   * @param {object} res
   * @returns {object} question object
   */
  async create(req, res) {
    const response = new APIResponse();
    const question = req.body;
    const meetupRecord = await MeetupController.findOne(question.meetupID);
    if (meetupRecord.length === 0) {
      response.setFailure(statusCodes.badRequest, 'Cannot post question to a meetup that does not exist');
      return response.send(res);
    }
    try {
      const { rows } = await db.query(QuestionModels.insertQuestionQuery, [
        new Date().toUTCString(), req.user.id, question.meetupID, question.body,
      ]);
      response.setSuccess(statusCodes.created, 'Question submitted successfully', rows[0]);
      return response.send(res);
    } catch (error) {
      response.setFailure(statusCodes.badRequest, 'Some error occurred. Try again');
      return response.send(res);
    }
  },

  /**
   * Upvotes a question
   * @param {object} req
   * @param {object} res
   * @returns {object} questionRecord
   */
  async upvote(req, res) {
    const response = new APIResponse();
    try {
      const { rows } = await db.query(QuestionModels.getOneQuery, [req.params.id]);
      if (rows.length === 0) {
        response.setFailure(statusCodes.forbidden, 'Cannot upvote a question that does not exist');
        return response.send(res);
      }
      const question = rows[0];
      // Cast upvote
      const rowCount = await Question.castVote([true, false, req.user.id, question.id], res);
      if (rowCount > 0) {
        // Get vote count
        const voteCount = await Question.getVoteCount(question.id, res);
        response.setSuccess(statusCodes.success, 'Vote recorded successfully', {
          meetup_id: question.meetup_id,
          title: question.title,
          body: question.body,
          votes: voteCount,
        });
        return response.send(res);
      }
    } catch (error) {
      response.setFailure(statusCodes.unavailable, 'Some error occurred. Please try again');
      return response.send(res);
    }
  },

  /**
   * Downvotes a question
   * @param {object} req
   * @param {object} res
   * @returns {object} questionRecord
   */
  async downvote(req, res) {
    const response = new APIResponse();
    try {
      const { rows } = await db.query(QuestionModels.getOneQuery, [req.params.id]);
      if (rows.length === 0) {
        response.setFailure(statusCodes.forbidden, 'Cannot downvote a question that does not exist');
        return response.send(res);
      }
      const question = rows[0];
      // Cast downvote
      const rowCount = await Question.castVote([false, true, req.user.id, question.id], res, 'downvote');
      if (rowCount > 0) {
        // Get vote count
        const voteCount = await Question.getVoteCount(question.id, res);
        response.setSuccess(statusCodes.success, 'Vote recorded successfully', {
          meetup_id: question.meetup_id,
          title: question.title,
          body: question.body,
          votes: voteCount,
        });
        return response.send(res);
      }
    } catch (error) {
      response.setFailure(statusCodes.unavailable, 'Some error occurred. Please try again');
      return response.send(res);
    }
  },

  /**
   * Get comments
   * @param {object} req
   * @param {object} res
   * @returns {object} comments
   */
  async getComments(req, res) {
    const response = new APIResponse();
    try {
      const { rows } = await db.query(QuestionModels.getOneQuery, [req.params.id]);
      if (rows.length === 0) {
        response.setFailure(statusCodes.forbidden, 'Question does not exist');
        return response.send(res);
      }

      const comments = await db.query(QuestionModels.getCommentsQuery, [req.params.id]);
      response.setSuccess(statusCodes.success, 'Comments retrieved successfully', comments.rows);
      return response.send(res);
    } catch (error) {
      response.setFailure(statusCodes.unavailable, 'Some error occurred. Try again');
      return response.send(res);
    }
  },

  /**
   * Delete a question
   * @param {object} req
   * @param {object} res
   * @returns {object} API response
   */
  async delete(req, res) {
    const response = new APIResponse();
    try {
      const { rows } = await db.query(QuestionModels.getOneQuery, [req.params.id]);
      if (rows.length === 0) {
        response.setFailure(statusCodes.forbidden, 'Question does not exist');
        return response.send(res);
      }
      // User has to be question owner or admin
      if ((req.user.id === rows[0].user_id) || req.user.isAdmin) {
        const { rowCount } = await db.query(QuestionModels.deleteOneQuery, [req.params.id]);
        if (rowCount > 0) {
          response.setSuccess(statusCodes.success, 'Question deleted successfully');
          return response.send(res);
        }
      }

      response.setFailure(statusCodes.unauthorized, 'Only admin and question owner can delete question');
      return response.send(res);
    } catch (error) {
      response.setFailure(statusCodes.unavailable, 'Some error occurred');
      return response.send(res);
    }
  },
};

export default Question;
