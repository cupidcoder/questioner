/* eslint-disable consistent-return */
import joi from 'joi';
import APIResponse from '../helpers/Response';
import statusCodes from '../helpers/status';
import UserModel from '../models/User';
import db from '../../db/index';
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
  async validateNewUser(req, res, next) {
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
    // Check if Email has already been used
    try {
      const { rows } = await db.query(UserModel.checkEmailQuery, [req.body.email]);
      if (rows[0]) {
        response.setFailure(statusCodes.badRequest, 'email has already been used');
        return response.send(res);
      }
    } catch (err) {
      response.setFailure(statusCodes.badRequest, 'Some error occurred. Try again.');
      return response.send(res);
    }
    next();
  },

  /**
   * Validate User login
   * @param {object} req
   * @param {object} res
   * @param {object} next
   */
  validateUserLogin(req, res, next) {
    const response = new APIResponse();
    const userObjectRules = joi.object().keys({
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
