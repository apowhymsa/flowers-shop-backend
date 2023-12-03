import express from "express";
import {
    createProduct,
    deleteProductById,
    getProductById,
    getProductByTitle,
    getProducts, updateProductById
} from "../database/schemes/products";

export const updateById = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        const {title, categoryID, variants} = req.body;
        const image = req.file.path;

        if (!id || !title || !categoryID || !variants || !image) {
            return res.sendStatus(403);
        }

        const foundProduct = await getProductByTitle(title);

        if (foundProduct) {
            if (foundProduct.id !== id) {
                return res.sendStatus(409);
            }
        }

        // Прочитать изображение как Base64
        const imageBuffer = require('fs').readFileSync(image);
        const base64Image = imageBuffer.toString('base64');

        const product = await updateProductById(id, {
            title, categoryID, variants, image: {
                name: req.file.originalname, data: `data:${req.file.mimetype};base64,${base64Image}`
            }
        });

        return res.status(200).json(product).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export const getById = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.sendStatus(403);
        }

        const product = await getProductById(id).populate(['categoryID', 'variants.ingredients.ingredient.id', 'variants.ingredients.ingredient.variantID']).exec();
        return res.status(200).json(product).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const deleteById = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.sendStatus(403);
        }

        const product = await deleteProductById(id);
        return res.status(200).json(product).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const getAll = async (req: express.Request, res: express.Response) => {
    try {
        const products = await getProducts().populate(['categoryID', 'variants.ingredients.ingredient.id', 'variants.ingredients.ingredient.variantID']).exec();

        return res.status(200).json(products).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export const create = async (req: express.Request, res: express.Response) => {
    try {
        const {title, categoryID, variants} = req.body;
        const image = req.file.path;

        if (!title || !categoryID || !variants || !image) {
            return res.sendStatus(403);
        }

        const foundProduct = await getProductByTitle(title);

        if (foundProduct) {
            return res.sendStatus(409);
        }

        // Прочитать изображение как Base64
        const imageBuffer = require('fs').readFileSync(image);
        const base64Image = imageBuffer.toString('base64');

        const product = await createProduct({
            title, categoryID, variants, image: {
                name: req.file.originalname, data: `data:${req.file.mimetype};base64,${base64Image}`
            }
        });

        return res.status(200).json(product).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}