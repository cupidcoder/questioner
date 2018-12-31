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
};

export default Meetup;
