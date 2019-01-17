import db from '../../db/index';
import QuestionModels from '../models/Question';
import statusCodes from '../helpers/status';
import APIResponse from '../helpers/Response';
import MeetupController from './Meetup';

/**
 * Question controller performs different actions for the question entity
 *
 */

const Question = {

  /**
     * Find one question record from the questions array
     * @param {*} id
     * @returns {Array} question object array
     */
  findOne(id) {
    const questionRecord = QuestionModels.filter(QuestionModel => QuestionModel.id === id);
    return questionRecord;
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
  upvote(req, res) {
    const response = new APIResponse();
    const questionRecord = Question.findOne(req.params.id);
    if (questionRecord.length === 0) {
      response.setFailure(statusCodes.forbidden, 'Cannot upvote question that does not exist');
      return response.send(res);
    }

    // At this point, the question being upvoted, exists
    const questionRecordIndex = QuestionModels.indexOf(questionRecord[0]);
    QuestionModels[questionRecordIndex].votes += 1;
    response.setSuccess(statusCodes.success, [{
      meetup: questionRecord[0].meetup,
      title: questionRecord[0].title,
      body: questionRecord[0].body,
      votes: questionRecord[0].votes,
    }]);
    return response.send(res);
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
