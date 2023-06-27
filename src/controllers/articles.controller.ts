import { NextFunction, Request, Response } from "express";
import { getArticleById } from "../models/articles.model";

export async function getArticle(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("in articles controller");

        const id = parseInt(req.params.id);
        console.log(id);

        const article = await getArticleById(id)
        res.send({ article });
    }
    catch (error) {
        next(error);
    }

}