import { NextFunction, Request, Response } from "express"
import { addCommentByArticleId, getCommentsByArticleId } from "../models/comments.model"
import { userFromRequest } from "../auth"

export async function getComments(req: Request, res: Response, next: NextFunction) {
    try {
        const article_id = parseInt(req.params.article_id)
        const comments = await getCommentsByArticleId(article_id)
        res.status(200).send({ comments })
    } catch (error) {
        next(error)
    }
}

export async function postComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { username } = userFromRequest(req)
        const { body } = req.body
        const article_id = parseInt(req.params.article_id)
        const comment = await addCommentByArticleId(article_id, username, body)
        res.status(201).send({ comment })
    }
    catch (error) {
        next(error)
    }
}
