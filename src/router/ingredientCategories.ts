import express from "express";
import {isAuthenticated} from "../middlewares";
import {create, deleteById, getAll, getById, updateById} from "../controllers/ingredientCategories";

export default (router: express.Router) => {
    router.get('/ingredientCategory/:id', getById);
    router.get('/ingredientCategories', getAll);
    router.put('/ingredientCategory', create);
    router.put('/ingredientCategory/:id', updateById);
    router.delete('/ingredientCategory/:id', deleteById);
}