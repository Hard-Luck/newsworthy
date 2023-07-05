import express, { Response } from 'express';
import topicsRouter from './topics';
import { isAuthorised, login } from '../auth';
import endpoints from '../endpoints.json';
import articlesRouter from './articles';
import commentsRouter from './comments';
import userRouter from './users';

const router = express.Router();
router.get('/', (_, res: Response) => {
    res.json(endpoints);
});

router.use("/login", login)
router.use(isAuthorised)
router.use("/topics", topicsRouter)
router.use("/articles", articlesRouter)
router.use("/comments", commentsRouter)
router.use("/users", userRouter)
export default router;
