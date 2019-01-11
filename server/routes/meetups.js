import express from 'express';
import MeetupController from '../controllers/Meetup';

const router = express.Router();

router.get('/', MeetupController.getAll);
router.get('/upcoming/', MeetupController.getUpcoming);
router.post('/', MeetupController.create);
router.get('/:id', MeetupController.getOne);
router.post('/:id/rsvp', MeetupController.respondToMeetup);

module.exports = router;
