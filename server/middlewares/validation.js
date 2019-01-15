/* eslint-disable consistent-return */
import joi from 'joi';
import APIResponse from '../helpers/Response';
import statusCodes from '../helpers/status';
/**
 * Validation function for controllers
 */

const validation = {
  /**
   * Validate meetup object
   * @param {object} req
   * @param {object} res
   * @param {object} next
   */
  validateMeetup(req, res, next) {
    const response = new APIResponse();
    const meetupObjectRules = {
      location: joi.string().trim().min(3).required(),
      topic: joi.string().trim().min(3).required(),
      description: joi.string().trim().min(3).required(),
      happeningOn: joi.date().timestamp('javascript').required(),
    };
    const { error } = joi.validate(req.body, meetupObjectRules);

    if (error) {
      response.setFailure(statusCodes.badRequest, error.details[0].message);
      return response.send(res);
    }
    next();
  },

  /**
   * Validate rsvp object
   * @param {object} req
   * @param {object} res
   * @param {object} next
   */
  validateRSVP(req, res, next) {
    const response = new APIResponse();
    const rsvpObjectRules = joi.object().keys({
      response: joi.string().trim().valid(['yes', 'no', 'maybe']).required(),
    });
    const { error } = joi.validate(req.body, rsvpObjectRules);
    if (error) {
      response.setFailure(statusCodes.badRequest, error.details[0].message);
      return response.send(res);
    }
    next();
  },
  /**
   * Validate User object
   * @param {object} req
   * @param {object} res
   * @param {object} next
   */
  validateUser(req, res, next) {
    const response = new APIResponse();
    const userObjectRules = joi.object().keys({
      firstname: joi.string().trim().min(3).required(),
      lastname: joi.string().trim().min(3).required(),
      email: joi.string().trim().email({ minDomainAtoms: 2 }).required(),
      password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    });
    const { error } = joi.validate(req.body, userObjectRules);
    if (error) {
      response.setFailure(statusCodes.badRequest, error.details[0].message);
      return response.send(res);
    }
    next();
  },
};

export default validation;
