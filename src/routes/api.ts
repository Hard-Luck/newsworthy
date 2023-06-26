import express, { Request, Response, NextFunction } from 'express';
import topicsRouter from './topics';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    // Your route handler logic goes here
});
router.use("/topics", topicsRouter)
export default router;
