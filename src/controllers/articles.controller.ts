import { NextFunction, Request, Response } from "express";
import { getAllArticles, getArticleById } from "../models/articles.model";

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