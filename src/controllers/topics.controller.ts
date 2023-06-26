import { NextFunction, Request, Response } from "express";
import { getAllTopics } from "../models/topics.model";

export async function getTopics(req: Request, res: Response, next: NextFunction) {
    try {
        const topics = await getAllTopics()
        res.status(200).send({ topics })
    } catch (error) {
        next(error)
    }
}