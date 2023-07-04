import { NextFunction, Request, Response } from "express";
import { getAllUsers } from "../models/users.model";


export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await getAllUsers()
        res.status(200).send({ users })
    } catch (error) {
        next(error)
    }
}