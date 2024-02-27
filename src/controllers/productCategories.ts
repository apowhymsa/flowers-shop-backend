import express from "express";
import {
  createProductCategory,
  deleteProductCategoryById,
  getProductCategories,
  getProductCategoryById,
  getProductCategoryByTitle,
  updateProductCategoryById,
} from "../database/schemes/productCategories";
import {
  getProductByCategoryId,
  getProductById,
} from "../database/schemes/products";
import path from "path";
import * as fs from "fs/promises";

export const getById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.sendStatus(403);
    }

    const productCategory = await getProductCategoryById(id);
    return res.status(200).json(productCategory).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const getAll = async (req: express.Request, res: express.Response) => {
  const { limit, page } = req.query;
  try {
    const productCategories = await getProductCategories()
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .exec();

    const productCategoriesCount = await getProductCategories()
      .countDocuments()
      .exec();

    return res
      .status(200)
      .json({ categories: productCategories, count: productCategoriesCount })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const deleteById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.sendStatus(403);
    }

    const foundProduct = await getProductByCategoryId(id);

    if (foundProduct) {
      return res.sendStatus(409);
    }

    const productCategory = await deleteProductCategoryById(id);
    const imageName = productCategory.toObject().image;
    const imagePathOriginal = path.resolve(
      __dirname,
      `../../uploads/${imageName}`
    );
    const imagePathMinify = path.resolve(
      __dirname,
      `../../uploads/m_${imageName}`
    );

    fs.unlink(imagePathOriginal)
      .then(() => console.log("deleted"))
      .catch((e) => console.error("delete image error", e));

    fs.unlink(imagePathMinify)
      .then(() => console.log("deleted"))
      .catch((e) => console.error("delete image error", e));

    return res.status(200).json(productCategory).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const updateById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { title, isNewImage, image } = req.body;

    console.log(title, isNewImage, image);

    if (!id || !title) {
      return res.sendStatus(403);
    }

    const duplicateProductCategory = await getProductCategoryByTitle(title);

    if (duplicateProductCategory) {
      if (duplicateProductCategory.id !== id) {
        return res.sendStatus(409);
      }
    }

    if (isNewImage) {
      const productCategory = await getProductCategoryById(id);
      const imageName = productCategory.toObject().image;

      const imagePathOriginal = path.resolve(
        __dirname,
        `../../uploads/${imageName}`
      );
      const imagePathMinify = path.resolve(
        __dirname,
        `../../uploads/m_${imageName}`
      );

      fs.unlink(imagePathOriginal)
        .then(() => console.log("deleted"))
        .catch((e) => console.error("delete image error", e));

      fs.unlink(imagePathMinify)
        .then(() => console.log("deleted"))
        .catch((e) => console.error("delete image error", e));
    }

    const productCategory = await updateProductCategoryById(id, {
      title,
      image: isNewImage ? (req.files as any).image.name : image,
    });

    return res.status(200).json(productCategory).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const create = async (req: express.Request, res: express.Response) => {
  try {
    const { title } = req.body;
    const image = (req.files as any)?.image;

    if (!title || !image) {
      return res.sendStatus(403);
    }

    const duplicateProductCategory = await getProductCategoryByTitle(title);

    if (duplicateProductCategory) {
      return res.sendStatus(409);
    }

    const productCategory = await createProductCategory({
      title,
      image: image.name,
    });

    return res.status(200).json(productCategory).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
