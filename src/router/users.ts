import express from "express";
import {deleteById, getAll, getByEmail} from "../controllers/users";
import {isAuthenticated} from "../middlewares";

export default (router: express.Router) => {
    router.get('/users/:email', getByEmail);
    router.get('/users', getAll);
    router.delete('/users/:id', deleteById);
}