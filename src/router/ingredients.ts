import express from "express";
import {isAuthenticated} from "../middlewares";
import {create, deleteById, getAll, getByCategoryId, updateById} from "../controllers/ingredients";

export default (router: express.Router) => {
    router.get('/ingredients/:cID', getByCategoryId)
    router.get('/ingredients', getAll);
    router.put('/ingredient', create);
    router.put('/ingredient/:id', updateById);
    router.delete('/ingredient/:id', deleteById);
}