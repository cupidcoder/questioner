import express from 'express';
import validation from '../middlewares/validation';
import imageUploader from '../helpers/imageUploader';
import MeetupController from '../controllers/Meetup';
import Auth from '../middlewares/Auth';

const router = express.Router();

router.get('/', Auth.verifyToken, MeetupController.getAll);
router.get('/upcoming/', Auth.verifyToken, MeetupController.getUpcoming);
router.post('/', [Auth.verifyToken, validation.validateMeetup], MeetupController.create);
router.get('/:id', [Auth.verifyToken, validation.validateParam], MeetupController.getOne);
router.get('/:id/questions', [Auth.verifyToken, validation.validateParam], MeetupController.getQuestions);
router.post('/:id/rsvp', [Auth.verifyToken, validation.validateParam, validation.validateRSVP], MeetupController.respondToMeetup);
router.delete('/:id', [Auth.verifyToken, validation.validateParam], MeetupController.delete);
router.patch('/:id/tags', [Auth.verifyToken, validation.validateParam, validation.validateTags], MeetupController.addTags);
router.patch('/:id/images', [Auth.verifyToken, validation.validateParam, imageUploader], MeetupController.addImages);

export default router;
