import express from 'express';
import { getTopics, postTopic } from '../controllers/topics.controller';

const topicsRouter = express.Router();

topicsRouter.route('/').get(getTopics).post(postTopic);

export default topicsRouter;
