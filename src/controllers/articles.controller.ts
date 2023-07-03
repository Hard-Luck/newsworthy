import { NextFunction, Request, Response } from "express";
import { getAllArticles, getArticleById, updateArticleVotes } from "../models/articles.model";

export async function getArticles(req: Request, res: Response, next: NextFunction) {
    try {
        const articles = await getAllArticles();
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