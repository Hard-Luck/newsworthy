import express from 'express';
import {
  deleteArticle,
  getArticle,
  getArticles,
  patchArticleVotes,
  postArticle
} from '../controllers/articles.controller';
import { getComments, postComment } from '../controllers/comments.controller';

const articlesRouter = express.Router();

articlesRouter.route('/').get(getArticles).post(postArticle);
articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticleVotes)
  .delete(deleteArticle);

articlesRouter
  .route('/:article_id/comments')
  .get(getComments)
  .post(postComment);

export default articlesRouter;
