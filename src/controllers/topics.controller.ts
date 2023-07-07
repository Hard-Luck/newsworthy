import { NextFunction, Request, Response } from 'express';
import { getAllTopics, insertTopic } from '../models/topics.model';

export async function getTopics(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const topics = await getAllTopics();
    res.status(200).send({ topics });
  } catch (error) {
    next(error);
  }
}

export async function postTopic(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const topic = await insertTopic(req.body);
    res.status(201).send({ topic });
  } catch (error) {
    next(error);
  }
}
