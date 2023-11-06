import express from "express";
import {
    createProductCategory, deleteProductCategoryById,
    getProductCategories, getProductCategoryById,
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

        if (!id || !title) {
            return res.sendStatus(403);
        }

        const productCategory = await updateProductCategoryById(id, {
            title
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

        if (!title) {
            return res.sendStatus(403);
        }

        const productCategory = await createProductCategory({
            title
        });

        return res.status(200).json(productCategory).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}