import express from 'express';
import QuestionController from '../controllers/Question';

const router = express.Router();

router.post('/', QuestionController.create);
router.patch('/:id/upvote', QuestionController.upvote);
router.patch('/:id/downvote', QuestionController.downvote);

module.exports = router;
