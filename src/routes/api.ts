import express, { Request, Response, NextFunction } from 'express';
import topicsRouter from './topics';
import { isAuthorised } from '../auth';

const router = express.Router();
router.use(isAuthorised)
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    // Your route handler logic goes here
});
router.use("/topics", topicsRouter)
export default router;
