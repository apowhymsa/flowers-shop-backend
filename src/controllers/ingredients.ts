import express from "express";
import {
    createIngredient, deleteIngredientById, getIngredientById,
    getIngredientByTitle,
    getIngredients, getIngredientsByCategoryId,
    updateIngredientById
} from "../database/schemes/ingredients";
import {merge, result} from "lodash";

export const deleteById = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.sendStatus(403);
        }

        const deletedIngredient = await deleteIngredientById(id);
        return res.status(200).json(deletedIngredient).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const getById = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.sendStatus(403);
        }

        const ingredient = await getIngredientById(id).populate('categoryID').exec();
        // const ingredientCategory = await getIngredientsByCategoryId(cID).populate('categoryID').exec();
        //
        // const mergeIngradeints = merge(ingredients, ingredientCategory);
        return res.status(200).json(ingredient).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const getByCategoryId = async (req: express.Request, res: express.Response) => {
    try {
        const { cID } = req.params;

        if (!cID) {
            return res.sendStatus(403);
        }

        const ingredients = await getIngredientsByCategoryId(cID);
        // const ingredientCategory = await getIngredientsByCategoryId(cID).populate('categoryID').exec();
        //
        // const mergeIngradeints = merge(ingredients, ingredientCategory);
        return res.status(200).json(ingredients).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const updateById = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        const { title, categoryID, variants} = req.body;
        const image = req.file.path;

        console.log(req.file);

        if (!id || !title || !categoryID || !variants) {
            return res.sendStatus(403);
        }

        // Прочитать изображение как Base64
        const imageBuffer = require('fs').readFileSync(image);
        const base64Image = imageBuffer.toString('base64');

        const ingredient = await updateIngredientById(id, {
            title,
            categoryID,
            variants,
            image: {
                name: req.file.originalname,
                data: `data:${req.file.mimetype};base64,${base64Image}`
            }
        });

        return res.status(200).json(ingredient).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const getAll = async (req: express.Request, res: express.Response) => {
    try {
        const ingredients = await getIngredients().populate('categoryID').exec();

        return res.status(200).json(ingredients).end();
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

        // Прочитать изображение как Base64
        const imageBuffer = require('fs').readFileSync(image);
        const base64Image = imageBuffer.toString('base64');

        const foundIngredient = await getIngredientByTitle(title);

        if (foundIngredient) {
            return res.sendStatus(409);
        }

        const ingredient = await createIngredient({
            title,
            categoryID,
            variants,
            image: {
                name: req.file.originalname,
                data: `data:${req.file.mimetype};base64,${base64Image}`
            }
        });

        return res.status(200).json(ingredient).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}