import express from "express";
import {isAuthenticated} from "../middlewares";
import {create, deleteById, getAllIngredients, getByCategoryId, updateById} from "../controllers/ingredients";

export default (router: express.Router) => {
    router.get('/ingredients/:cID', getByCategoryId)
    router.get('/ingredients', getAllIngredients);
    router.put('/ingredient', create);
    router.put('/ingredient/:id', updateById);
    router.delete('/ingredient/:id', deleteById);
}