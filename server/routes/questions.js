import express from 'express';
import validation from '../middlewares/validation';
import QuestionController from '../controllers/Question';
import Auth from '../middlewares/Auth';

const router = express.Router();

router.post('/', [Auth.verifyToken, validation.validateQuestion], QuestionController.create);
router.patch('/:id/upvote', [Auth.verifyToken, validation.validateParam], QuestionController.upvote);
router.patch('/:id/downvote', QuestionController.downvote);

module.exports = router;
