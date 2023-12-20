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
import multer from "multer";
import path from "path";
import fs from "fs";
import { getProductsByCategoryId } from "../database/schemes/products";

// Настройка Multer для обработки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = "./uploads/"; // Specify your desired upload folder

    // Check if the folder exists, and create it if not
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }

    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
    // console.log(file.originalname, file.filename);
    // cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export default (router: express.Router) => {
  router.get("/product/:id", getById);
  router.get("/products", getAll);
  router.get("/products-includes", searchByTitleIncludes);
  router.get("/new-products", getNew);
  router.post("/product-variant-by-id", getByIds);
  router.get("/products-by/:categoryID", getByCategoryId);
  router.put("/product", upload.single("image"), create);
  router.put("/product/:id", upload.single("image"), updateById);
  router.delete("/product/:id", deleteById);
};
