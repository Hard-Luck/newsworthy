import express from 'express';
import {
  deleteComment,
  patchComment
} from '../controllers/comments.controller';
const commentsRouter = express.Router();

commentsRouter.route('/:comment_id').delete(deleteComment).patch(patchComment);

export default commentsRouter;
