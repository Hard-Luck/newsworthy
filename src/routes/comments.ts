import express from 'express';
import { deleteComment } from '../controllers/comments.controller';
const commentsRouter = express.Router();

commentsRouter.route('/:comment_id').delete(deleteComment)

export default commentsRouter;