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
   * @param {int} id
   * @param {object} res
   * @returns {Array} meetup object array
   */
  async findOne(id, res) {
    const response = new APIResponse();
    try {
      const { rows } = await db.query(MeetupModels.getOneQuery, [id]);
      const meetupRecord = rows;
      return meetupRecord;
    } catch (error) {
      response.setFailure(statusCodes.unavailable, 'Some error occurred. Please try again');
      return response.send(res);
    }
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
    const createdOn = new Date().toUTCString();
    const happeningOn = new Date(meetupRequest.happeningOn).toUTCString();
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
  async getAll(req, res) {
    const response = new APIResponse();
    try {
      const { rows } = await db.query(MeetupModels.getAllQuery);
      const meetups = rows;
      response.setSuccess(statusCodes.success, meetups);
      return response.send(res);
    } catch (error) {
      response.setFailure(statusCodes.unavailable, 'An error occurred. Please try again');
      return response.send(res);
    }
  },

  /**
   * Returns a specific meetup record
   * @param {object} req
   * @param {object} res
   * @returns {object} meetup record
   */
  async getOne(req, res) {
    const response = new APIResponse();
    const { id } = req.params;
    try {
      const meetupRecord = await Meetup.findOne(id, res);
      if (meetupRecord.length === 0) {
        response.setFailure(statusCodes.notFound, 'Meetup not found');
        return response.send(res);
      }
      // At this point, a meetup was found
      response.setSuccess(statusCodes.success, meetupRecord);
      return response.send(res);
    } catch (error) {
      response.setFailure(statusCodes.unavailable, 'Some error occurred. Please try again');
      return response.send(res);
    }
  },

  /**
   * Return meetups in ascending order by happeningOn
   * @returns {Array} upcomingMeetups
   */
  async getUpcoming(req, res) {
    const response = new APIResponse();
    try {
      const { rows } = await db.query(MeetupModels.getAllQuery);
      const meetups = rows;
      if (meetups.length > 0) {
        const upcomingMeetups = meetups;
        upcomingMeetups.sort(
          (previousMeetup, nextMeetup) => new Date(previousMeetup.happening_on).getTime()
          - new Date(nextMeetup.happening_on).getTime(),
        );
        response.setSuccess(statusCodes.success, upcomingMeetups);
        return response.send(res);
      }
      response.setSuccess(statusCodes.success);
      return response.send(res);
    } catch (error) {
      response.setFailure(statusCodes.unavailable, 'Some error occurred. Please try again');
      return response.send(res);
    }
  },

  /**
   * Delete a meetup record
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   */
  // eslint-disable-next-line consistent-return
  async delete(req, res) {
    const response = new APIResponse();
    const { id } = req.params;
    if (!req.user.isAdmin) {
      response.setFailure(statusCodes.unauthorized, 'You do not have permission to delete meetup');
      return response.send(res);
    }
    try {
      const meetupRecord = await Meetup.findOne(id, res);
      if (meetupRecord.length === 0) {
        response.setFailure(statusCodes.notFound, 'Meetup not found');
        return response.send(res);
      }
      // At this point, a meetup was found
      const { rowCount } = await db.query(MeetupModels.deleteMeetup, [meetupRecord[0].id]);
      if (rowCount === 1) {
        response.setSuccess(statusCodes.success, ['Meetup deleted successfully']);
        return response.send(res);
      }
    } catch (error) {
      response.setFailure(statusCodes.unavailable, 'Some error occurred. Please try again');
      return response.send(res);
    }
  },
  /**
   * Respond to attend meetup
   * @param {object} req
   * @param {object} res
   * @returns {object} rsvp
   */
  // eslint-disable-next-line consistent-return
  async respondToMeetup(req, res) {
    const response = new APIResponse();
    const rsvp = req.body;
    const { user } = req;
    try {
      const meetupRecord = await Meetup.findOne(req.params.id);
      if (meetupRecord.length === 0) {
        response.setFailure(statusCodes.forbidden, 'Cannot respond to a meetup that does not exist');
        return response.send(res);
      }
      // Here, the meetup exists
      const { rowCount } = await db.query(RsvpModel.insertRSVPQuery, [
        user.id, req.params.id, rsvp.response,
      ]);
      if (rowCount === 1) {
        response.setSuccess(statusCodes.created, {
          meetup_id: meetupRecord[0].id,
          topic: meetupRecord[0].topic,
          status: rsvp.response,
        });
        return response.send(res);
      }
    } catch (error) {
      response.setFailure(statusCodes.unavailable, 'Some error occurred. Please try again');
      return response.send(res);
    }
  },
};

export default Meetup;
