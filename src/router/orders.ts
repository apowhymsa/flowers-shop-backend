import express from "express";
import { create, getAll, getById, getByUserId } from "../controllers/orders";

export default (router: express.Router) => {
  router.get("/orders", getAll);
  router.get("/userOrders/:id", getByUserId);
  router.get("/order/:id", getById);
  router.put("/order", create);
};
