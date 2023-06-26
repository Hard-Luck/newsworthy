import express, { Request, Response, NextFunction } from 'express';
import { getAllTopics } from '../models/topics.model';
import { getTopics } from '../controllers/topics.controller';

const topicsRouter = express.Router();

topicsRouter.get('/', getTopics);

export default topicsRouter;