import uuid from 'uuid/v4';
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
  create(req, res) {
    const response = new APIResponse();
    const meetup = req.body;
    if (!meetup.location || !meetup.topic || !meetup.description || !meetup.happeningOn) {
      response.setFailure(statusCodes.badRequest, 'Required fields are empty');
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
    const meetupRecord = Meetup.findOne(req.params.id);
    if (meetupRecord.length === 0) {
      response.setFailure(statusCodes.forbidden, 'Cannot respond to a meetup that does not exist');
      return response.send(res);
    }
    const rsvp = req.body;
    if (!rsvp.user || !rsvp.response) {
      response.setFailure(statusCodes.badRequest, 'Required fields are empty');
      return response.send(res);
    }

    // rsvp data to be saved
    const newRsvpRecord = {
      id: uuid(),
      meetup: req.params.id,
      user: rsvp.user,
      response: rsvp.response,
    };
    // Let's check if rsvp data is empty
    const rsvpRecords = RsvpModel;
    if (rsvpRecords.length > 0) {
      // Here records already exist in the RsvpModel, Let's check if this user has responded already
      const duplicates = rsvpRecords.filter(
        el => el.meetup === req.params.id && el.user === rsvp.user,
      );

      if (duplicates.length > 0) {
        response.setFailure(statusCodes.forbidden, 'You have already responded to this meetup');
        return response.send(res);
      }
      // At this point, no duplicate entry exist
      RsvpModel.push(newRsvpRecord);
      const [meetup] = meetupRecord;
      response.setSuccess(statusCodes.created, [{
        meetup: meetup.id,
        topic: meetup.topic,
        status: rsvp.response,
      }]);
      return response.send(res);
    }
    // At this point, RsvpModel is emtpy
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
