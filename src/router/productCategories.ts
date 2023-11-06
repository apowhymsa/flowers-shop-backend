import express from "express";
import {create, deleteById, getAll, getById, updateById} from "../controllers/productCategories";

export default (router: express.Router) => {
    router.get('/productCategory/:id', getById);
    router.get('/productCategories', getAll);
    router.put('/productCategory', create);
    router.put('/productCategory/:id', updateById);
    router.delete('/productCategory/:id', deleteById);
}