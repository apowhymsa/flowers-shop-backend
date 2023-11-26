import express from "express";
import {createProduct, getProductByTitle, getProducts} from "../database/schemes/products";

export const getAll = async (req: express.Request, res: express.Response) => {
    try {
        const products = await getProducts();

        return res.status(200).json(products).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export const create = async (req: express.Request, res: express.Response) => {
    try {
        const {title, categoryID, price, discount, variants} = req.body;

        if (!title || !categoryID || !price || !discount || !variants) {
            return res.sendStatus(403);
        }

        const foundProduct = await getProductByTitle(title);

        if (foundProduct) {
            return res.sendStatus(409);
        }

        const product = await createProduct({
            title, categoryID, price, discount, variants
        });

        return res.status(200).json(product).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}