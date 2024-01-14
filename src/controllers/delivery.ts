import express from "express";
import {getCurrentDeliveryPrice, updateDeliveryPrice} from "../database/schemes/delivery";

export const getDeliveryPrice = async (req: express.Request, res: express.Response) => {
    try {
        const deliveryPrice = await getCurrentDeliveryPrice();

        return res.status(200).json(deliveryPrice);
    } catch (err) {
        return res.sendStatus(500);
    }
}
export const updateById = async (req: express.Request, res: express.Response) => {
    try {
        const {id, price} = req.body;

        if (!id || !price) {
            return res.sendStatus(403);
        }

        const updatedPrice = await updateDeliveryPrice(id, {
            price
        });

        return res.status(200).json(updatedPrice);
    } catch (err) {
        return res.sendStatus(500)
    }
}