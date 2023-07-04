import express from 'express';
import { getUsers } from '../controllers/users.controller';
const userRouter = express.Router();

userRouter.route('/').get(getUsers)

export default userRouter;