import express from "express";
import {createOrder, getOrders} from "../database/schemes/orders";

export const create = async (req: express.Request, res: express.Response) => {
    const {description, phoneNumber, userFullName, shippingAddress, products, payment} = req.body;

    if (!payment || !description || !phoneNumber || !userFullName || !shippingAddress || !products) {
        return res.sendStatus(403);
    }

    const order = await createOrder({
        description, phoneNumber, userFullName, shippingAddress, products, payment
    });

    return res.status(200).json(order);
}
export const getAll = async (req: express.Request, res: express.Response) => {
    try {
        const orders = await getOrders();

        return res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}