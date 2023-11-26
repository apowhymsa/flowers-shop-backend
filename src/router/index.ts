import express from "express";
import authentication from "./authentication";
import users from "./users";
import ingredients from "./ingredients";
import ingredientCategories from "./ingredientCategories";
import productCategories from "./productCategories";
import products from "./products";

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    ingredients(router);
    ingredientCategories(router);
    productCategories(router);
    products(router);

    return router;
}