import express from 'express';
import MeetupController from '../controllers/Meetup';

const router = express.Router();

router.get('/upcoming/', MeetupController.getUpcoming);

router.post('/', MeetupController.create);

router.get('/', MeetupController.getAll);

router.get('/:id', MeetupController.getOne);

module.exports = router;
