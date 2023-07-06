import { NextFunction, Request, Response } from "express";
import { getAllArticles, getArticleById, insertArticle, updateArticleVotes } from "../models/articles.model";
import { userFromRequest } from "../auth";

export async function getArticles(req: Request, res: Response, next: NextFunction) {
    try {
        const { sort_by, order, topic } = req.query as { sort_by: string, order: string, topic: string }
        const articles = await getAllArticles({ sort_by, order, topic });
        res.send({ articles })
    } catch (error) {
        next(error);
    }

}


export async function getArticle(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.article_id);
        const article = await getArticleById(id)
        res.send({ article });
    }
    catch (error) {
        next(error);
    }

}

export async function patchArticleVotes(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.article_id);
        const votes = req.body.inc_votes;
        const article = await updateArticleVotes(id, votes);
        res.status(200).send({ article });
    }
    catch (error) {
        next(error);
    }

}

export async function postArticle(req: Request, res: Response, next: NextFunction) {
    try {
        const { username } = userFromRequest(req)
        const articleToPost = { author: username, ...req.body }
        const votes = req.body.inc_votes;
        const article = await insertArticle(articleToPost);
        res.status(201).send({ article });
    }
    catch (error) {
        next(error);
    }

}