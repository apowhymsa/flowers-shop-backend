import express from "express";
import {create, getByProductId} from "../controllers/comments";

export default (router: express.Router) => {
    router.get('/comments/:productID', getByProductId);
    router.put('/comment', create);
}