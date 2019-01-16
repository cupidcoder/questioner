import db from '../../db/index';
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
  async create(req, res) {
    const response = new APIResponse();
    const meetupRequest = req.body;
    if (!req.user.isAdmin) {
      response.setFailure(statusCodes.unauthorized, 'You do not have permission to create meetup');
      return response.send(res);
    }
    const createdOn = new Date().toLocaleString();
    const happeningOn = new Date(meetupRequest.happeningOn).toLocaleString();
    const newMeetup = [meetupRequest.location, createdOn, meetupRequest.topic, happeningOn];
    try {
      const { rows } = await db.query(MeetupModels.insertMeetupQuery, newMeetup);
      const meetup = rows[0];
      response.setSuccess(statusCodes.created, meetup);
      return response.send(res);
    } catch (error) {
      response.setFailure(statusCodes.unavailable, 'Some error occurred. Try again');
      return response.send(res);
    }
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
        (previousMeetup, nextMeetup) => new Date(previousMeetup.happeningOn)
        - new Date(nextMeetup.happeningOn),
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
