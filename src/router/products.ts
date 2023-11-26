import express from "express";
import {create, getAll} from "../controllers/products";

export default (router: express.Router) => {
    router.get('/products', getAll);
    router.put('/product', create);
}