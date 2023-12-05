import express from "express";
import {getImage} from "../controllers/images";

export default (router: express.Router) => {
    router.get('/images/:imageName', getImage);
}