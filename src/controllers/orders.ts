import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatusById,
  updateOrderById,
} from "../database/schemes/orders";

import { ProductModel } from "../database/schemes/products";
import nodemailer from "nodemailer";
import { getUserById } from "../database/schemes/users";

export const update = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res.sendStatus(403);
  }

  try {
    const updatedOrder = await updateOrderStatusById(id, status)
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

    const user = await getUserById(updatedOrder.userID.toString());

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "clumbaeshop@gmail.com",
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const att = updatedOrder.products.map((product, index) => {
      return {
        filename: (product.product_id as any).image,
        href: `http://localhost:3001/images/${
          (product.product_id as any).image
        }`,
        cid: `${(product.product_id as any).image}-${index}@nodemailer.com`,
      };
    });

    const mailOptions = {
      from: "clumbaeshop@gmail.com",
      to: user.email,
      subject: `Статус замовлення №${updatedOrder.payment.liqpayPaymentID} було оновлено`,
      html: `<p style="margin-bottom: 10px">Вас вітає магазин квітів "Clumba". Статус вашого замовлення №${updatedOrder.payment.liqpayPaymentID} було оновлено на <span style="font-weight: bold">${status}</span></p>`,
    };

    // console.log('attachments', att);

    transporter.sendMail(mailOptions).catch((error) => console.log(error));

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const create = async (req: express.Request, res: express.Response) => {
  const {
    description,
    phoneNumber,
    userFullName,
    shippingAddress,
    products,
    deliveryTime,
    comment,
    payment,
  } = req.body;

  if (
    !payment ||
    !description ||
    !phoneNumber ||
    !userFullName ||
    !shippingAddress ||
    !products ||
    !deliveryTime
  ) {
    return res.sendStatus(403);
  }

  const order = await createOrder({
    description,
    phoneNumber,
    userFullName,
    shippingAddress,
    products,
    comment,
    payment,
  });

  return res.status(200).json(order);
};
export const getByUserId = async (
  req: express.Request,
  res: express.Response
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
    const { ignoreViewed } = req.query;
    let order = await getOrderById(id)
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

    if (!ignoreViewed && !order.isViewed) {
      order = await updateOrderById(id, {
        isViewed: true,
      })
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
    }

    console.log(order);

    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const getAll = async (req: express.Request, res: express.Response) => {
  const { filter } = req.query;
  let filterStatus = "";
  let ordersFilterByStatus = {};

  switch (filter) {
    case "0":
      filterStatus = "all";
      break;
    case "1":
      filterStatus = "processing";
      break;
    case "2":
      filterStatus = "packing";
      break;
    case "3":
      filterStatus = "shipping";
      break;
    case "4":
      filterStatus = "waiting";
      break;

    case "5":
      filterStatus = "complete";
      break;

    default:
      filterStatus = "all";
      break;
  }

  if (filterStatus !== "all") {
    ordersFilterByStatus = { status: { $in: filterStatus } };
  }

  const query = {
    ...ordersFilterByStatus,
  };

  console.log(filter);
  try {
    const orders = await getOrders(query)
      .sort({ _id: -1 })
      .populate(["products.product_id"])
      .exec();

    const nowViewedOrders = await getOrders({
      isViewed: false,
    });

    return res.status(200).json({ orders, nowViewedOrders });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
