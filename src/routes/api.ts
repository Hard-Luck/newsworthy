import express, { Response } from 'express';
import topicsRouter from './topics';
import { isAuthorised } from '../auth';
import endpoints from '../endpoints.json';
import articlesRouter from './articles';

const router = express.Router();
router.get('/', (_, res: Response) => {
    res.json(endpoints);
});
router.use(isAuthorised)
router.use("/topics", topicsRouter)
router.use("/articles", articlesRouter)
export default router;
