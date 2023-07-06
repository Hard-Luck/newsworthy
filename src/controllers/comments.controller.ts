import { NextFunction, Request, Response } from 'express';
import {
  addCommentByArticleId,
  deleteCommentById,
  getCommentsByArticleId,
  updateCommentVotes
} from '../models/comments.model';
import { userFromRequest } from '../auth';

export async function getComments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const article_id = parseInt(req.params.article_id);
    const comments = await getCommentsByArticleId(article_id);
    res.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
}

export async function postComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username } = userFromRequest(req);
    const { body } = req.body;
    const article_id = parseInt(req.params.article_id);
    const comment = await addCommentByArticleId(article_id, username, body);
    res.status(201).send({ comment });
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username } = userFromRequest(req);
    const { comment_id } = req.params;
    await deleteCommentById(+comment_id, username);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function patchComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    const comment = await updateCommentVotes(+comment_id, inc_votes);
    res.status(200).send({ comment });
  } catch (error) {
    next(error);
  }
}
