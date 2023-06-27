import { NextFunction, Request, Response } from "express"
import { getCommentsByArticleId } from "../models/comments.model"

export async function getComments(req: Request, res: Response, next: NextFunction) {
    try {
        const article_id = parseInt(req.params.article_id)
        const comments = await getCommentsByArticleId(article_id)
        res.status(200).send({ comments })
    } catch (error) {
        // console.log(error);
        next(error)
    }
}
