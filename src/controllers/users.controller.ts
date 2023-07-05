import { NextFunction, Request, Response } from "express";
import { getAllUsers, getUserByUsername } from "../models/users.model";


export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await getAllUsers()
        res.status(200).send({ users })
    } catch (error) {
        next(error)
    }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { username } = req.params
        const user = await getUserByUsername(username)
        res.status(200).send({ user })
    } catch (error) {
        next(error)
    }

}
