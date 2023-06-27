import express from 'express';
import { getArticle, getArticles } from '../controllers/articles.controller';

const articlesRouter = express.Router();

articlesRouter.route('/').get(getArticles);
articlesRouter.route('/:id').get(getArticle);

export default articlesRouter;