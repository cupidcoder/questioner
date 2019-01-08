import uuid from 'uuid/v4';
import QuestionModels from '../models/Question';
import statusCodes from '../helpers/status';
import APIResponse from '../helpers/Response';

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
  create(req, res) {
    const response = new APIResponse();
    const question = req.body;
    if (!question.createdBy || !question.meetup || !question.title || !question.body) {
      response.setFailure(statusCodes.badRequest, 'Required fields are empty');
      return response.send(res);
    }
    const newQuestionRecord = {
      id: uuid(),
      createdOn: new Date().getTime(),
      createdBy: question.createdBy,
      meetup: question.meetup,
      title: question.title,
      body: question.body,
      votes: 0, // Starts at zero
    };

    QuestionModels.push(newQuestionRecord);
    response.setSuccess(statusCodes.created, newQuestionRecord);
    return response.send(res);
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
