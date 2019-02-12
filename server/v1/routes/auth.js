import express from 'express';
import validation from '../middlewares/validation';
import UserController from '../controllers/User';

const router = express.Router();

router.post('/signup', validation.validateNewUser, UserController.signup);
router.post('/login', validation.validateUserLogin, UserController.login);

export default router;
