import express from "express";
import {
  create,
  deleteById,
  getAll,
  getByIds,
  getByCategoryId,
  getById,
  getNew,
  searchByTitleIncludes,
  updateById,
} from "../controllers/products";
import { minifyImage, uploadOImage } from "../middlewares";

export default (router: express.Router) => {
  router.get("/product/:id", getById);
  router.get("/products", getAll);
  router.get("/products-includes", searchByTitleIncludes);
  router.get("/new-products", getNew);
  router.post("/product-variant-by-id", getByIds);
  router.get("/products-by/:categoryID", getByCategoryId);
  router.put("/product", uploadOImage, minifyImage, create);
  router.put("/product/:id", uploadOImage, minifyImage, updateById);
  router.delete("/product/:id", deleteById);
};
