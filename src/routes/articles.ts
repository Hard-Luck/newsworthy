import express from 'express';
import { getArticle } from '../controllers/articles.controller';

const articlesRouter = express.Router();

articlesRouter.get('/:id', getArticle);

export default articlesRouter;