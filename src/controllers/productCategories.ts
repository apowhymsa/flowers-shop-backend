import express from "express";
import {
    createProductCategory, deleteProductCategoryById,
    getProductCategories, getProductCategoryById, getProductCategoryByTitle,
    updateProductCategoryById
} from "../database/schemes/productCategories";
import {getProductById} from "../database/schemes/products";
import path from "path";
import * as fs from "fs/promises";

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
        const imageName = productCategory.toObject().image;
        const imagePath = path.resolve(__dirname, `../../uploads/${imageName}`);
        await fs.unlink(imagePath).then(() => console.log('deleted'));

        return res.status(200).json(productCategory).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const updateById = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        const {title, isNewImage, image} = req.body;
        // const image = req.file.path;

        console.log(title, isNewImage, image);

        if (!id || !title) {
            return res.sendStatus(403);
        }

        const duplicateProductCategory = await getProductCategoryByTitle(title);

        if (duplicateProductCategory) {
            if (duplicateProductCategory.id !== id) {
                return res.sendStatus(409);
            }
        }

        if (isNewImage) {
            const productCategory = await getProductCategoryById(id);
            const imageName = productCategory.toObject().image;

            const imagePath = path.resolve(__dirname, `../../uploads/${imageName}`);

            await fs.unlink(imagePath).then(() => console.log('deleted'));
        }

        const productCategory = await updateProductCategoryById(id, {
            title,
            image: isNewImage ? req.file.filename : image
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

        const productCategory = await createProductCategory({
            title,
            image: req.file.filename
        });

        return res.status(200).json(productCategory).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}