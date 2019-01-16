import express from 'express';
import validation from '../middlewares/validation';
import MeetupController from '../controllers/Meetup';
import Auth from '../middlewares/Auth';

const router = express.Router();

router.get('/', Auth.verifyToken, MeetupController.getAll);
router.get('/upcoming/', MeetupController.getUpcoming);
router.post('/', [Auth.verifyToken, validation.validateMeetup], MeetupController.create);
router.get('/:id', [Auth.verifyToken,validation.validateParam], MeetupController.getOne);
router.post('/:id/rsvp', validation.validateRSVP, MeetupController.respondToMeetup);

module.exports = router;
