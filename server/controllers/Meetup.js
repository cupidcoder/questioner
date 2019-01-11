import uuid from 'uuid/v4';
import joi from 'joi';
import MeetupModels from '../models/Meetup';
import RsvpModel from '../models/Rsvp';
import statusCodes from '../helpers/status';
import APIResponse from '../helpers/Response';

/**
 * Meetup controller performs different actions for the meetup entity
 *
 */

const Meetup = {

  /**
   * Validate meetup object
   * @param {object} newMeetupObject
   * @returns {object} joiErrorObject
   */
  validateMeetup(newMeetupObject) {
    const meetupObjectRules = {
      location: joi.string().min(3).required(),
      topic: joi.string().min(3).required(),
      description: joi.string().min(3).required(),
      happeningOn: joi.date().timestamp('javascript').required(),
    };
    return joi.validate(newMeetupObject, meetupObjectRules);
  },

  /**
   * Validate rsvp object
   * @param {object} newRSVPObject
   * @returns {object} joiErrorObject
   */
  validateRSVP(newRSVPObject) {
    const rsvpObjectRules = joi.object().keys({
      response: joi.string().valid(['yes', 'no', 'maybe']).required(),
    });
    return joi.validate(newRSVPObject, rsvpObjectRules);
  },

  /**
   * Find one meetup record from the meetups array
   * @param {*} id
   * @returns {Array} meetup object array
   */
  findOne(id) {
    const meetupRecord = MeetupModels.filter(MeetupModel => MeetupModel.id === id);
    return meetupRecord;
  },

  /**
   * Creates a meetup record
   * @param {object} req
   * @param {object} res
   * @returns {object} apiResponse
   */
  create(req, res) {
    const response = new APIResponse();
    const meetup = req.body;
    const { error } = Meetup.validateMeetup(meetup);

    if (error) {
      response.setFailure(statusCodes.badRequest, error.details[0].message);
      return response.send(res);
    }
    const newMeetupRecord = {
      id: uuid(),
      createdOn: new Date().getTime(),
      location: meetup.location,
      images: '',
      topic: meetup.topic,
      description: meetup.description,
      happeningOn: meetup.happeningOn,
      tags: '',
    };

    MeetupModels.push(newMeetupRecord);
    response.setSuccess(statusCodes.created, newMeetupRecord);
    return response.send(res);
  },

  /**
   * Returns all created meetups
   * @param {object} res
   * @param {object} req
   * @returns {Array} meetups
   */
  getAll(req, res) {
    const response = new APIResponse();
    if (MeetupModels.length === 0) {
      response.setSuccess(statusCodes.success);
      return response.send(res);
    }
    // At this point, MeetupModel.length > 0
    const meetups = MeetupModels;
    response.setSuccess(statusCodes.success, meetups);
    return response.send(res);
  },

  /**
   * Returns a specific meetup record
   * @param {object} req
   * @param {object} res
   * @returns {object} meetup record
   */
  getOne(req, res) {
    const response = new APIResponse();
    const { id } = req.params;
    const meetupRecord = Meetup.findOne(id);
    if (meetupRecord.length === 0) {
      response.setFailure(statusCodes.notFound, 'Meetup not found');
      return response.send(res);
    }
    // At this point, a meetup was found
    response.setSuccess(statusCodes.success, meetupRecord);
    return response.send(res);
  },

  /**
   * Return meetups in ascending order by happeningOn
   * @returns {Array} upcomingMeetups
   */
  getUpcoming(req, res) {
    const response = new APIResponse();
    if (MeetupModels.length > 0) {
      const upcomingMeetups = MeetupModels;
      upcomingMeetups.sort(
        (previousMeetup, nextMeetup) => previousMeetup.happeningOn - nextMeetup.happeningOn,
      );
      response.setSuccess(statusCodes.success, upcomingMeetups);
      return response.send(res);
    }
    response.setSuccess(statusCodes.success);
    return response.send(res);
  },
  /**
   * Respond to attend meetup
   * @param {object} req
   * @param {object} res
   * @returns {object} rsvp
   */
  respondToMeetup(req, res) {
    const response = new APIResponse();
    const rsvp = req.body;
    const meetupRecord = Meetup.findOne(req.params.id);
    if (meetupRecord.length === 0) {
      response.setFailure(statusCodes.forbidden, 'Cannot respond to a meetup that does not exist');
      return response.send(res);
    }
    const { error } = Meetup.validateRSVP(rsvp);
    if (error) {
      response.setFailure(statusCodes.badRequest, error.details[0].message);
      return response.send(res);
    }

    // rsvp data to be saved
    const newRsvpRecord = {
      id: uuid(),
      meetup: req.params.id,
      response: rsvp.response,
    };

    RsvpModel.push(newRsvpRecord);
    const [meetup] = meetupRecord;
    response.setSuccess(statusCodes.created, [{
      meetup: meetup.id,
      topic: meetup.topic,
      status: rsvp.response,
    }]);
    return response.send(res);
  },
};

export default Meetup;
