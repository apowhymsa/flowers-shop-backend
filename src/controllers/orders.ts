import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  getUserOrders,
} from "../database/schemes/orders";

import { ProductModel } from "../database/schemes/products";

export const create = async (req: express.Request, res: express.Response) => {
  const {
    description,
    phoneNumber,
    userFullName,
    shippingAddress,
    products,
    payment,
  } = req.body;

  if (
    !payment ||
    !description ||
    !phoneNumber ||
    !userFullName ||
    !shippingAddress ||
    !products
  ) {
    return res.sendStatus(403);
  }

  const order = await createOrder({
    description,
    phoneNumber,
    userFullName,
    shippingAddress,
    products,
    payment,
  });

  return res.status(200).json(order);
};
export const getByUserId = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const orders = await getUserOrders(id)
      .sort({ _id: -1 })
      .populate({
        path: "products.product_id",
        model: ProductModel, // Замените Product на ваш объект модели Product
        populate: [
          {
            path: "variants.ingredients.ingredient.id",
            model: "Ingredient", // Замените Ingredient на ваш объект модели Ingredient
          },
          {
            path: "variants.ingredients.ingredient.variantID",
            model: "IngredientVariant", // Замените Ingredient на ваш объект модели Ingredient
          },
        ],
      })
      .exec();

    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const getById = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id)
      .populate({
        path: "products.product_id",
        model: ProductModel, // Замените Product на ваш объект модели Product
        populate: [
          {
            path: "variants.ingredients.ingredient.id",
            model: "Ingredient", // Замените Ingredient на ваш объект модели Ingredient
          },
          {
            path: "variants.ingredients.ingredient.variantID",
            model: "IngredientVariant", // Замените Ingredient на ваш объект модели Ingredient
          },
        ],
      })
      .exec();

    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const getAll = async (req: express.Request, res: express.Response) => {
  try {
    const orders = await getOrders()
      .sort({ _id: -1 })
      .populate(["products.product_id"])
      .exec();

    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
