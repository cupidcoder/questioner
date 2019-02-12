import express from 'express';
import validation from '../middlewares/validation';
import CommentController from '../controllers/Comment';
import Auth from '../middlewares/Auth';

const router = express.Router();

router.post('/', [Auth.verifyToken, validation.validateComment], CommentController.create);
router.delete('/:id', [Auth.verifyToken, validation.validateParam], CommentController.delete);

export default router;
