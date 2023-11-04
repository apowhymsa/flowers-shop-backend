import express from "express";
import {deleteById, getAllUsers, getByEmail} from "../controllers/users";
import {isAuthenticated} from "../middlewares";

export default (router: express.Router) => {
    router.get('/users/:email', getByEmail);
    router.get('/users', isAuthenticated, getAllUsers);
    router.delete('/users/:id', deleteById);
}