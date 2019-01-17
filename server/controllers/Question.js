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
        new Date().toUTCString(), question.userID, question.meetupID, question.title, question.body,
      ]);
      response.setSuccess(statusCodes.created, rows[0]);
      return response.send(res);
    } catch (error) {
      response.setFailure(statusCodes.badRequest, 'Non existent user ID was supplied');
      return response.send(res);
    }
  },

  /**
   * Upvotes a question
   * @param {object} req
   * @param {object} res
   * @returns {object} questionRecord
   */
  // eslint-disable-next-line consistent-return
  async upvote(req, res) {
    const response = new APIResponse();
    try {
      const { rows } = await db.query(QuestionModels.getOneQuery, [req.params.id]);
      if (rows.length === 0) {
        response.setFailure(statusCodes.forbidden, 'Cannot upvote a question that does not exist');
        return response.send(res);
      }
      const question = rows[0];
      // Insert vote into votes table
      const { rowCount } = await db.query(VoteModels.insertQuestionVote,
        [true, false, req.user.id, question.id]);
      if (rowCount > 0) {
        // Get number of votes
        const ups = await db.query(VoteModels.getUPVotesQuery, [question.id]);
        const downs = await db.query(VoteModels.getDOWNVotesQuery, [question.id]);
        // eslint-disable-next-line max-len
        const vote = ((ups.rows[0].votes - downs.rows[0].votes) < 0) ? 0 : ups.rows[0].votes - downs.rows[0].votes;
        response.setSuccess(statusCodes.success, {
          meetup_id: question.meetup_id,
          title: question.title,
          body: question.body,
          votes: vote,
        });
        return response.send(res);
      }
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        response.setFailure(statusCodes.forbidden, 'You have already voted to this question');
        return response.send(res);
      }
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
  downvote(req, res) {
    const response = new APIResponse();
    const questionRecord = Question.findOne(req.params.id);
    if (questionRecord.length === 0) {
      response.setFailure(statusCodes.forbidden, 'Cannot downvote question that does not exist');
      return response.send(res);
    }

    // At this point, the question being upvoted, exists
    const questionRecordIndex = QuestionModels.indexOf(questionRecord[0]);
    if (QuestionModels[questionRecordIndex].votes === 0) {
      QuestionModels[questionRecordIndex].votes = 0;
    } else if (QuestionModels[questionRecordIndex].votes > 0) {
      QuestionModels[questionRecordIndex].votes -= 1;
    }
    response.setSuccess(statusCodes.success, [{
      meetup: questionRecord[0].meetup,
      title: questionRecord[0].title,
      body: questionRecord[0].body,
      votes: questionRecord[0].votes,
    }]);
    return response.send(res);
  },
};

export default Question;
