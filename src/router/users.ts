import express from "express";
import {deleteById, getAll, getByEmail, getById, updateById} from "../controllers/users";
import {isAuthenticated} from "../middlewares";

export default (router: express.Router) => {
    router.put('/user/:id', updateById);
    router.get('/user/:id', getById);
    router.get('/users/:email', getByEmail);
    router.get('/users', getAll);
    router.delete('/users/:id', deleteById);
}