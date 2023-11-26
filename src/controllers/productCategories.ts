import express from "express";
import {
    createProductCategory, deleteProductCategoryById,
    getProductCategories, getProductCategoryById, getProductCategoryByTitle,
    updateProductCategoryById
} from "../database/schemes/productCategories";

export const getById = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;

        if (!id) {
            return res.sendStatus(403);
        }

        const productCategory = await getProductCategoryById(id);
        return res.status(200).json(productCategory).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const getAll = async (req: express.Request, res: express.Response) => {
    try {
        const productCategories = await getProductCategories();
        return res.status(200).json(productCategories).end();
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

        const productCategory = await deleteProductCategoryById(id);
        return res.status(200).json(productCategory).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const updateById = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        const {title} = req.body;
        const image = req.file.path;

        if (!id || !title || !image) {
            return res.sendStatus(403);
        }

        const duplicateProductCategory = await getProductCategoryByTitle(title);

        if (duplicateProductCategory.id !== id) {
            return res.sendStatus(409);
        }

        // Прочитать изображение как Base64
        const imageBuffer = require('fs').readFileSync(image);
        const base64Image = imageBuffer.toString('base64');
        console.log(req.file);

        const productCategory = await updateProductCategoryById(id, {
            title,
            image: {
                name: req.file.originalname,
                data: `data:${req.file.mimetype};base64,${base64Image}`
            }
        });

        return res.status(200).json(productCategory).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const create = async (req: express.Request, res: express.Response) => {
    try {
        const {title} = req.body;
        const image = req.file.path;

        if (!title || !image) {
            return res.sendStatus(403);
        }

        const duplicateProductCategory = await getProductCategoryByTitle(title);

        if (duplicateProductCategory) {
            return res.sendStatus(409);
        }

        // Прочитать изображение как Base64
        const imageBuffer = require('fs').readFileSync(image);
        const base64Image = imageBuffer.toString('base64');
        console.log(req.file);

        const productCategory = await createProductCategory({
            title,
            image: {
                name: req.file.originalname,
                data: `data:${req.file.mimetype};base64,${base64Image}`
            }
        });

        return res.status(200).json(productCategory).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}