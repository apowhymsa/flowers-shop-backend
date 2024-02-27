import express from "express";
const fs = require("fs");
import {
  create,
  deleteById,
  getAll,
  getByCategoryId,
  getById,
  updateById,
} from "../controllers/ingredients";
import { minifyImage, uploadOImage } from "../middlewares";

export default (router: express.Router) => {
  router.get("/ingredient/:id", getById);
  router.get("/ingredients/:cID", getByCategoryId);
  router.get("/ingredients", getAll);
  router.put("/ingredient", uploadOImage, minifyImage, create);
  router.put("/ingredient/:id", uploadOImage, minifyImage, updateById);
  router.delete("/ingredient/:id", deleteById);
};
