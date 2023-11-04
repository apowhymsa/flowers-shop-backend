import express from "express";
import {createUser, getUserByEmail, getUserByPhone, getUserBySessionToken} from "../database/schemes/users";
import {authentication, random} from "../helpers";

export const logout = async (req: express.Request, res: express.Response) => {
    try {
        console.log(req.cookies);
        // res.clearCookie('USER-AUTH', {domain: 'localhost'});

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if (!user) {
            return res.sendStatus(404);
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(401);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('USER-AUTH', user.authentication.sessionToken, {domain: 'localhost'});

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500)
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password, fullName, phoneNumber, avatar} = req.body;

        if (!email || !password || !fullName || !phoneNumber || !avatar) {
            return res.sendStatus(400);
        }

        const existingUserByPhone = await getUserByPhone(phoneNumber);

        if (existingUserByPhone) {
            return res.sendStatus(409);
        }

        const salt = random();
        const user = await createUser({
            email, personals: {
                fullName, phoneNumber, avatar
            }, authentication: {
                password: authentication(salt, password), salt,
            }
        });

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}