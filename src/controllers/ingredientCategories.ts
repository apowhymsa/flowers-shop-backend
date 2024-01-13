import express from "express";
import {
    createIngredientCategory, deleteIngredientCategoryById,
    getIngredientCategories,
    getIngredientCategoryById, getIngredientCategoryByTitle, updateIngredientCategoryById
} from "../database/schemes/ingredientCategories";
import {getIngredientByCategoryId} from "../database/schemes/ingredients";

export const updateById = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        const {title} = req.body;

        if (!id || !title) {
            return res.sendStatus(403);
        }

        const foundIngredientCategory = await getIngredientCategoryByTitle(title);

        if (foundIngredientCategory) {
            if (foundIngredientCategory.id !== id) {
                return res.sendStatus(409);
            }
        }

        const ingredientCategory = await updateIngredientCategoryById(id, {
            title
        });

        return res.status(200).json(ingredientCategory).end();
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

        const foundIngredientsById = await getIngredientByCategoryId(id);

        if (foundIngredientsById) {
            return res.sendStatus(409);
        }

        const ingredientCategory = await deleteIngredientCategoryById(id);

        return res.status(200).json(ingredientCategory).end();
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

        const ingredientCategory = await getIngredientCategoryById(id);

        return res.status(200).json(ingredientCategory).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const getAll = async (req: express.Request, res: express.Response) => {
    try {
        const ingredientCategories = await getIngredientCategories();

        return res.status(200).json(ingredientCategories).end();
    } catch (error) {
        console.log(500);
        return res.sendStatus(500);
    }
}
export const create = async (req: express.Request, res: express.Response) => {
    try {
        const {title} = req.body;

        if (!title) {
            return res.sendStatus(403);
        }

        const foundIngredientCategory = await getIngredientCategoryByTitle(title);

        if (foundIngredientCategory) {
            return res.sendStatus(409);
        }

        const ingredientCategory = await createIngredientCategory({
            title
        });

        return res.status(200).json(ingredientCategory).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}