import express from "express";
import {getUserByEmail, getUsers} from "../database/schemes/users";

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const getByEmail = async (req: express.Request, res: express.Response) => {
    try {
        const {email} = req.params;

        const user = await getUserByEmail(email);

        if (!user) {
            return res.sendStatus(400);
        }

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}