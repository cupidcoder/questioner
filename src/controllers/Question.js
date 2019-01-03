import uuid from 'uuid/v4';
import QuestionModel from '../models/Question';
import statusCodes from '../helpers/status';

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
    const questionRecord = QuestionModel.filter(el => el.id === id);
    return questionRecord;
  },

  /**
   * Creates a question record
   * @param {object} req
   * @param {object} res
   * @returns {object} question object
   */
  create(req, res) {
    const question = req.body;
    if (!question.createdBy || !question.meetup || !question.title || !question.body) {
      return res.status(statusCodes.badRequest).send({
        status: statusCodes.badRequest,
        error: 'Required fields are empty',
      });
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

    QuestionModel.push(newQuestionRecord);
    return res.status(statusCodes.created).send({
      status: statusCodes.created,
      data: [newQuestionRecord],
    });
  },

  /**
   * Upvotes a question
   * @param {object} req
   * @param {object} res
   * @returns {object} questionRecord
   */
  upvote(req, res) {
    const questionRecord = Question.findOne(req.params.id);
    if (questionRecord.length === 0) {
      return res.status(statusCodes.forbidden).send({
        status: statusCodes.forbidden,
        error: 'Cannot upvote question that does not exist',
      });
    }

    // At this point, the question being upvoted, exists
    const questionRecordIndex = QuestionModel.indexOf(questionRecord[0]);
    QuestionModel[questionRecordIndex].votes += 1;
    return res.status(statusCodes.success).send({
      status: statusCodes.success,
      data: [{
        meetup: questionRecord[0].meetup,
        title: questionRecord[0].title,
        body: questionRecord[0].body,
        votes: questionRecord[0].votes,
      }],
    });
  },

  /**
   * Downvotes a question
   * @param {object} req
   * @param {object} res
   * @returns {object} questionRecord
   */
  downvote(req, res) {
    const questionRecord = Question.findOne(req.params.id);
    if (questionRecord.length === 0) {
      return res.status(statusCodes.forbidden).send({
        status: statusCodes.forbidden,
        error: 'Cannot downvote question that does not exist',
      });
    }

    // At this point, the question being upvoted, exists
    const questionRecordIndex = QuestionModel.indexOf(questionRecord[0]);
    if (QuestionModel[questionRecordIndex].votes === 0) {
      QuestionModel[questionRecordIndex].votes = 0;
    } else if (QuestionModel[questionRecordIndex].votes > 0) {
      QuestionModel[questionRecordIndex].votes -= 1;
    }
    return res.status(statusCodes.success).send({
      status: statusCodes.success,
      data: [{
        meetup: questionRecord[0].meetup,
        title: questionRecord[0].title,
        body: questionRecord[0].body,
        votes: questionRecord[0].votes,
      }],
    });
  },
};

export default Question;
