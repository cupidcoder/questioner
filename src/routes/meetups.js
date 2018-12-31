import express from 'express';
import MeetupController from '../controllers/Meetup';

const router = express.Router();

router.post('/', MeetupController.create);

module.exports = router;
