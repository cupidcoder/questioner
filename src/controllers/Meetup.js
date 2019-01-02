import uuid from 'uuid/v4';
import MeetupModel from '../models/Meetup';
import RsvpModel from '../models/Rsvp';
import statusCodes from '../helpers/status';

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
    const meetupRecord = MeetupModel.filter(el => el.id === id);
    return meetupRecord;
  },

  /**
   * Creates a meetup record
   * @param {object} req
   * @param {object} res
   * @returns {object} apiResponse
   */
  create(req, res) {
    const meetup = req.body;
    if (!meetup.location || !meetup.topic || !meetup.description || !meetup.happeningOn) {
      return res.status(statusCodes.badRequest).send({
        status: statusCodes.badRequest,
        error: 'Required fields are empty',
      });
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

    MeetupModel.push(newMeetupRecord);
    return res.status(statusCodes.created).send({
      status: statusCodes.created,
      data: [newMeetupRecord],
    });
  },

  /**
   * Returns all created meetups
   * @param {object} res
   * @param {object} req
   * @returns {Array} meetups
   */
  getAll(req, res) {
    if (MeetupModel.length === 0) {
      return res.status(statusCodes.success).send({
        status: statusCodes.success,
        data: [],
      });
    }
    // At this point, MeetupModel.length > 0
    const meetups = MeetupModel;
    return res.status(statusCodes.success).send({
      status: statusCodes.success,
      data: meetups,
    });
  },

  /**
   * Returns a specific meetup record
   * @param {object} req
   * @param {object} res
   * @returns {object} meetup record
   */
  getOne(req, res) {
    const { id } = req.params;
    const meetupRecord = Meetup.findOne(id);
    if (meetupRecord.length === 0) {
      return res.status(statusCodes.notFound).send({
        status: statusCodes.notFound,
        error: 'Meetup not found',
      });
    }
    // At this point, a meetup was found
    return res.status(statusCodes.success).send({
      status: statusCodes.success,
      data: meetupRecord,
    });
  },

  /**
   * Return meetups in ascending order by happeningOn
   * @returns {Array} upcomingMeetups
   */
  getUpcoming(req, res) {
    if (MeetupModel.length > 0) {
      const upcomingMeetups = MeetupModel;
      upcomingMeetups.sort((a, b) => a.happeningOn - b.happeningOn);
      return res.status(statusCodes.success).send({
        status: statusCodes.success,
        data: upcomingMeetups,
      });
    }
    return res.status(statusCodes.success).send({
      status: statusCodes.success,
      data: [],
    });
  },
  /**
   * Respond to attend meetup
   * @param {object} req
   * @param {object} res
   * @returns {object} rsvp
   */
  respondToMeetup(req, res) {
    const meetupRecord = Meetup.findOne(req.params.id);
    if (meetupRecord.length === 0) {
      return res.status(statusCodes.forbidden).send({
        status: statusCodes.forbidden,
        error: 'Cannot respond to a meetup that does not exist',
      });
    }
    const rsvp = req.body;
    if (!rsvp.user || !rsvp.response) {
      return res.status(statusCodes.badRequest).send({
        status: statusCodes.badRequest,
        error: 'Required fields are empty',
      });
    }
    // Let's check if rsvp data is empty
    const rsvpRecords = RsvpModel;
    if (rsvpRecords.length > 0) {
      // Here records already exist in the RsvpModel, Let's check if this user has responded already
      const duplic = rsvpRecords.filter(el => el.meetup === req.params.id && el.user === rsvp.user);

      if (duplic.length > 0) {
        return res.status(statusCodes.forbidden).send({
          status: statusCodes.forbidden,
          error: 'You have already responded to this meetup',
        });
      }
      // At this point, no duplicate entry exist
      const newRsvpRecord = {
        id: uuid(),
        meetup: req.params.id,
        user: rsvp.user,
        response: rsvp.response,
      };
      RsvpModel.push(newRsvpRecord);
      const [meetup] = meetupRecord;
      return res.status(statusCodes.created).send({
        status: statusCodes.created,
        data: [{
          meetup: meetup.id,
          topic: meetup.topic,
          status: rsvp.response,
        }],
      });
    }
    // At this point, RsvpModel is emtpy
    const newRsvpRecord = {
      id: uuid(),
      meetup: req.params.id,
      user: rsvp.user,
      response: rsvp.response,
    };
    RsvpModel.push(newRsvpRecord);
    const [meetup] = meetupRecord;
    return res.status(statusCodes.created).send({
      status: statusCodes.created,
      data: [{
        meetup: meetup.id,
        topic: meetup.topic,
        status: rsvp.response,
      }],
    });
  },
};

export default Meetup;
