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

};

export default Question;
