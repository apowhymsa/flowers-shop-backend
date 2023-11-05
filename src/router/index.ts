import express from "express";
import authentication from "./authentication";
import users from "./users";
import ingredients from "./ingredients";
import ingredientCategories from "./ingredientCategories";

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    ingredients(router);
    ingredientCategories(router);

    return router;
}