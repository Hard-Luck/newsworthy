import express from 'express';
import { getArticle, getArticles } from '../controllers/articles.controller';
import { getComments } from '../controllers/comments.controller';

const articlesRouter = express.Router();

articlesRouter.route('/').get(getArticles);
articlesRouter.route('/:article_id').get(getArticle);

articlesRouter.route('/:article_id/comments').get(getComments);

export default articlesRouter;