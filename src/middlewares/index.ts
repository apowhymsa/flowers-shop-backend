import express from "express";
import {get, merge} from 'lodash';
import {getUserBySessionToken} from "../database/schemes/users";

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.params;
    const currentUserID = get(req, 'identity._id') as string;

    if (!currentUserID) {
        return res.sendStatus(400);
    }

    if (currentUserID.toString() !== id) {
        return res.sendStatus(400);
    }

    return next();
}
export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['USER-AUTH'];

        if (!sessionToken) {
            return res.sendStatus(403);
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.sendStatus(403);
        }

        merge(req, {identity: existingUser});

        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}