import express from "express";
import authentication from "./authentication";
import users from "./users";
import ingredients from "./ingredients";

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    ingredients(router);

    return router;
}