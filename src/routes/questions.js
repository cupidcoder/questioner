import express from 'express';
import QuestionController from '../controllers/Question';

const router = express.Router();

router.post('/', QuestionController.create);

module.exports = router;
