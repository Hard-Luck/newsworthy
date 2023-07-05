import express from 'express';
import { getUser, getUsers } from '../controllers/users.controller';
const userRouter = express.Router();

userRouter.route('/').get(getUsers)
userRouter.route('/:username').get(getUser)
export default userRouter;