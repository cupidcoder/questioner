import uuid from 'uuid/v4';
import MeetupModel from '../models/Meetup';

/**
 * Meetup controller performs different actions for the meetup entity
 *
 */

const Meetup = {
  /**
   * Creates a meetup record
   * @param {object} req
   * @param {object} res
   * @returns {object} apiResponse
   */
  create(req, res) {
    const meetup = req.body;
    if (!meetup.location || !meetup.topic || !meetup.description || !meetup.happeningOn) {
      return res.status(400).send({
        status: 400,
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
    return res.status(201).send({
      status: 201,
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
      return res.status(200).send({
        status: 200,
        data: [],
      });
    }
    // At this point, MeetupModel.length > 0
    const meetups = MeetupModel;
    return res.status(200).send({
      status: 200,
      data: meetups,
    });
  },
};

export default Meetup;
