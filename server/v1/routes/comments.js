import express from 'express';
import validation from '../middlewares/validation';
import CommentController from '../controllers/Comment';
import Auth from '../middlewares/Auth';

const router = express.Router();

router.post('/', [Auth.verifyToken, validation.validateComment], CommentController.create);

module.exports = router;
