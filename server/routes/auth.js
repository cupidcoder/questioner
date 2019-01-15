import express from 'express';
import validation from '../middlewares/validation';
import UserController from '../controllers/User';

const router = express.Router();

router.post('/signup', validation.validateUser, UserController.signup);

module.exports = router;
