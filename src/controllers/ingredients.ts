import express from "express";
import {
  createIngredient,
  deleteIngredientById,
  getIngredientById,
  getIngredientByTitle,
  getIngredients,
  getIngredientsByCategoryId,
  updateIngredientById,
} from "../database/schemes/ingredients";
import { merge, result } from "lodash";
import {
  createIngredientVariant,
  deleteIngredientVariantById,
  getIngredientVariantById,
  updateIngredientVariantById,
} from "../database/schemes/ingredientVariants";
import path from "path";
import fs from "fs/promises";
import { getProductCategoryById } from "../database/schemes/productCategories";
import { getProductByIngredientId } from "../database/schemes/products";

export const deleteById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.sendStatus(403);
    }

    const foundProduct = await getProductByIngredientId(id);

    if (foundProduct) {
      return res.sendStatus(409);
    }

    const deletedIngredient = await deleteIngredientById(id);
    const imageName = deletedIngredient.toObject().image;

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

    return res.status(200).json(deletedIngredient).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const getById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.sendStatus(403);
    }

    const ingredient = await getIngredientById(id)
      .populate(["categoryID", "variants.id"])
      .exec();
    // const ingredientCategory = await getIngredientsByCategoryId(cID).populate('categoryID').exec();
    //
    // const mergeIngradeints = merge(ingredients, ingredientCategory);
    return res.status(200).json(ingredient).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const getByCategoryId = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { cID } = req.params;

    if (!cID) {
      return res.sendStatus(403);
    }

    const ingredients = await getIngredientsByCategoryId(cID);
    // const ingredientCategory = await getIngredientsByCategoryId(cID).populate('categoryID').exec();
    //
    // const mergeIngradeints = merge(ingredients, ingredientCategory);
    return res.status(200).json(ingredients).end();
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
    let { title, categoryID, variants, isNewImage, image } = req.body;

    variants = JSON.parse(variants);

    if (!id || !title || !categoryID || !variants) {
      return res.sendStatus(403);
    }

    const variantIDs: any[] = [];
    const foundIngredient = await getIngredientById(id)
      .populate(["categoryID"])
      .exec();

    let forIterationLength = 0;

    if (foundIngredient.variants.length > variants.length) {
      forIterationLength = foundIngredient.variants.length;
    } else if (foundIngredient.variants.length < variants.length) {
      forIterationLength = variants.length;
    } else {
      forIterationLength = variants.length;
    }

    for (let i = 0; i < forIterationLength; i++) {
      console.log("foundIngredient", foundIngredient.variants[i]);
      console.log("variants", variants[i]);

      //i > foundIngredient.variants.length ||
      if (foundIngredient.variants[i] === undefined) {
        const ingV = await createIngredientVariant({
          vType: variants[i].vType,
          count: variants[i].count,
        });

        variantIDs.push({
          id: ingV._id,
        });
      }
      if (variants[i] === undefined) {
        await deleteIngredientVariantById(
          foundIngredient.variants[i].id.toString()
        );
      }

      if (
        foundIngredient.variants[i] !== undefined &&
        variants[i] !== undefined
      ) {
        const updatedIngredientVariant = await updateIngredientVariantById(
          foundIngredient.variants[i].id.toString(),
          {
            vType: variants[i].vType,
            count: variants[i].count,
          }
        );

        variantIDs.push({
          id: updatedIngredientVariant._id,
        });
      }
    }

    console.log(variantIDs);

    if (isNewImage) {
      const ingredient = await getIngredientById(id);
      const imageName = ingredient.toObject().image;

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

    const ingredient = await updateIngredientById(id, {
      title,
      categoryID,
      variants: variantIDs,
      image: isNewImage ? (req.files as any).image.name : image,
    })
      .populate(["categoryID", "variants.id"])
      .exec();

    return res.status(200).json(ingredient).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const getAll = async (req: express.Request, res: express.Response) => {
  try {
    const ingredients = await getIngredients()
      .populate(["categoryID", "variants.id"])
      .exec();

    return res.status(200).json(ingredients).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const create = async (req: express.Request, res: express.Response) => {
  try {
    const { title, categoryID, variants } = req.body;

    if (!title || !categoryID || !variants) {
      return res.sendStatus(403);
    }

    const variantIDs: any[] = [];

    for (const variant of JSON.parse(variants)) {
      const ingV = await createIngredientVariant({
        vType: variant.vType,
        count: variant.count,
      });

      variantIDs.push({
        id: ingV._id,
      });
    }

    const foundIngredient = await getIngredientByTitle(title);

    if (foundIngredient) {
      return res.sendStatus(409);
    }

    const ingredient = await createIngredient({
      title,
      categoryID,
      variants: variantIDs,
      image: (req.files as any).image.name,
    });

    return res.status(200).json(ingredient).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
