import express from "express";
import {
    createIngredient, deleteIngredientById, getIngredientById,
    getIngredientByTitle,
    getIngredients, getIngredientsByCategoryId,
    updateIngredientById
} from "../database/schemes/ingredients";
import {result} from "lodash";


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
export const getByCategoryId = async (req: express.Request, res: express.Response) => {
    try {
        const { cID } = req.params;

        if (!cID) {
            return res.sendStatus(403);
        }

        const ingredients = await getIngredientsByCategoryId(cID);
        return res.status(200).json(ingredients).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const updateById = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        const { title, categoryID, variants,  } = req.body;

        if (!id || !title || !categoryID || !variants) {
            return res.sendStatus(403);
        }

        const ingredient = await updateIngredientById(id, {
            title,
            categoryID,
            variants
        });

        return res.status(200).json(ingredient).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
export const getAll = async (req: express.Request, res: express.Response) => {
    try {
        const ingredients = await getIngredients();

        return res.status(200).json(ingredients).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export const create = async (req: express.Request, res: express.Response) => {
    try {
        const {title, categoryID, variants} = req.body;

        if (!title || !categoryID || !variants) {
            return res.sendStatus(403);
        }

        const foundIngredient = await getIngredientByTitle(title);

        if (foundIngredient) {
            return res.sendStatus(409);
        }

        const ingredient = await createIngredient({
            title,
            categoryID,
            variants
        });

        return res.status(200).json(ingredient).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}