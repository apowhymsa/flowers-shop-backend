import express from "express";
import {
  create,
  deleteById,
  getAll,
  getById,
  updateById,
} from "../controllers/productCategories";
import { minifyImage, uploadOImage } from "../middlewares";

export default (router: express.Router) => {
  router.get("/productCategory/:id", getById);
  router.get("/productCategories", getAll);
  router.put("/productCategory", uploadOImage, minifyImage, create);
  router.put("/productCategory/:id", uploadOImage, minifyImage, updateById);
  router.delete("/productCategory/:id", deleteById);
};
