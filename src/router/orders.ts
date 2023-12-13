import express from "express";
import {create, getAll} from "../controllers/orders";

export default (router: express.Router) => {
    router.get('/orders', getAll);
    router.put('/order', create);
}