import express from "express";
import {deleteUserById, getUserByEmail, getUserById, getUsers, setCart} from "../database/schemes/users";


export const updateById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const {data} = req.body;

    if (!id || !data) {
        return res.sendStatus(403);
    }

    try {
        const user = await setCart(id, {
            ...data
        });

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const deleteById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const user = await deleteUserById(id);

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const getById = async (req: express.Request, res: express.Response) => {
    const {id} = req.params;

    if (!id) {
        return res.sendStatus(403);
    }

    try {
        const user = await getUserById(id).populate(['cart.product']);

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const getAll = async (req: express.Request, res: express.Response) => {
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