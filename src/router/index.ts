import express from "express";
import authentication from "./authentication";
import users from "./users";
import ingredients from "./ingredients";
import ingredientCategories from "./ingredientCategories";
import productCategories from "./productCategories";

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    ingredients(router);
    ingredientCategories(router);
    productCategories(router);

    return router;
}