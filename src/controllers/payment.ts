import crypto from "crypto";
import express from "express";
import axios from "axios";
import {
  createOrder,
  getOrderById,
  updateOrderById,
} from "../database/schemes/orders";
import moment from "moment-timezone";
import {
  getProductById,
  ProductModel,
  updateProductById,
} from "../database/schemes/products";
import { updateIngredientVariantById } from "../database/schemes/ingredientVariants";
import nodemailer from "nodemailer";
import { updateUserById } from "../database/schemes/users";

const str_to_sign = function str_to_sign(str: string) {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }

  const sha1 = crypto.createHash("sha1");
  sha1.update(str);
  return sha1.digest("base64");
};

export const success = async (req: express.Request, res: express.Response) => {
  console.log(req.body);
  return res.send(req.body);
};

export const error = async (req: express.Request, res: express.Response) => {
  console.log(req.body);
  return res.send(req.body);
};

export const cancel = async (req: express.Request, res: express.Response) => {
  console.log(req.body);
  return res.send(req.body);
};

export const tempPayment = async (
  req: express.Request,
  res: express.Response
) => {
  const { amount, description, additionalData } = req.body;
  const date = moment.tz(Date.now(), "Europe/Kyiv").toString();

  const orderParams = {
    userID: additionalData.userID,
    phoneNumber: additionalData.phone,
    products: additionalData.products.map((product: any) => {
      return {
        count: product.count,
        product_id: product.product_id,
        productVariant: product.productVariant,
      };
    }),
    userFullName: additionalData.name,
    shippingAddress: additionalData.shippingAddress,
    deliveryTime: additionalData.deliveryTime,
    comment: additionalData.comment,
    description: description,
    payment: {
      status: false,
      bonuses: additionalData.bonuses,
      amount: additionalData.amountWoDeliveryPrice,
      deliveryPrice: additionalData.deliveryPrice,
      liqpayPaymentID: Date.now(),
    },
    createdAt: date,
  };

  const order = await createOrder({
    ...orderParams,
  });

  const user = await updateUserById(order.userID.id.toString(), {
    cart: [],
    promo: {
      ordersSummary: Math.round(
        (order.userID as any).promo.ordersSummary + Number(order.payment.amount)
      ),
      bonuses: Math.round(
        (Number(order.payment.amount) / 100) *
          (order.userID as any).promo.bonusesPercent +
          (order.userID as any).promo.bonuses -
          Number(order.payment.bonuses)
      ),
      bonusesPercent:
        (order.userID as any).promo.ordersSummary +
          Number(order.payment.amount) <
        10000
          ? 2
          : 4,
    },
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "clumbaeshop@gmail.com",
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const att = order.products.map((product, index) => {
    return {
      filename: (product.product_id as any).image,
      href: `http://localhost:3001/images/${(product.product_id as any).image}`,
      cid: `${(product.product_id as any).image}-${index}@nodemailer.com`,
    };
  });

  const mailOptions = {
    from: "clumbaeshop@gmail.com",
    to: ["clumbaeshop@gmail.com"],
    subject: `Нове замовлення №${order.payment.liqpayPaymentID}`,
    html: `${order.products.map((product, index) => {
      return `
                <tr>
                <td style="height: 125px; width: 125px; max-height: 125px; max-width: 125px; padding-right: 12px"><img style="width: 100%; height: 100%" src="cid:${
                  att[index].cid
                }" alt="${att[index].filename}" /></td>
                <td>
                <p>Назва товару: ${(product.product_id as any).title}</p>
                <p>Варіант товару: ${product.productVariant.title}</p>
                <p>Кількість товару: ${product.count}</p>
                </td>
                </tr>
                <hr style="width: 100%; display: block"/>
                `;
    })}`,
    attachments: [...att],
  };

  console.log("attachments", att);

  transporter.sendMail(mailOptions).catch((error) => console.log(error));

  return res.status(200).json(order);
};

export const tempPaymentPayed = async (
  req: express.Request,
  res: express.Response
) => {
  const { orderID, status } = req.body;

  if (!orderID || !status) return res.sendStatus(403);

  const order = await getOrderById(orderID);

  if (order) {
    if (order.payment.status === true) {
      const result = order.products.map(async (pObject: any) => {
        const product = await getProductById(pObject.product_id)
          .populate([
            "categoryID",
            "variants.ingredients.ingredient.id",
            "variants.ingredients.ingredient.variantID",
          ])
          .exec();

        const tmp = product.variants.map((pVariant: any) => {
          if (pVariant.id === pObject.productVariant.id) {
            pVariant.ingredients.map(async (ing: any) => {
              const updateCount =
                Number(ing.ingredient.variantID.count) -
                Number(ing.count) * Number(pObject.count);

              const updatedIngVariant = await updateIngredientVariantById(
                ing.ingredient.variantID.id,
                {
                  count: updateCount,
                }
              );
            });
          }
        });
      });
    }

    const updatedOrder = await updateOrderById(orderID, {
      "payment.status": Boolean(status),
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

    return res.status(200).json(updatedOrder);
  } else {
    return res.sendStatus(404);
  }
};

export const result = async (req: express.Request, res: express.Response) => {
  const encodedData = req.body.data;
  const decodedData = Buffer.from(encodedData, "base64").toString("utf-8");

  const { status } = JSON.parse(decodedData);

  res.cookie("cookie", status, {
    maxAge: 1000 * 60 * 15,
  });

  return res.send(
    `RESULT: ${
      status === "success"
        ? '<div style="color: green">SUCCESS</div>'
        : '<div style="color: red">ERROR</div>'
    }`
  );
};
export const createPaymentURL = async (
  req: express.Request,
  res: express.Response
) => {
  const { amount, description, additionalData } = req.body;

  console.log(additionalData);

  const params = {
    action: "pay",
    amount: amount,
    currency: "UAH",
    description: description,
    info: JSON.stringify({
      userID: additionalData.userID,
      amountWoDeliveryPrice: additionalData.amountWoDeliveryPrice,
      deliveryPrice: additionalData.deliveryPrice,
      bonuses: additionalData.bonuses,
      comment: additionalData.comment,
      products: additionalData.products.map((product: any) => {
        return {
          count: product.count,
          product_id: product.product_id,
          productVariant: product.productVariant,
        };
      }),
      phone: additionalData.phone,
      shippingAddress: additionalData.shippingAddress,
      deliveryTime: additionalData.deliveryTime,
      name: additionalData.name,
    }),
    public_key: process.env.LIQPAY_PUBLIC_KEY, // private_key: process.env.LIQPAY_PRIVATE_KEY,
    server_url: `https://b015-178-213-2-105.ngrok-free.app/payment/callback`,
    result_url: "https://b015-178-213-2-105.ngrok-free.app/result",
  };

  const data = Buffer.from(JSON.stringify(params)).toString("base64");
  const signature = str_to_sign(
    process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY
  );

  axios
    .post(
      "https://www.liqpay.ua/api/3/checkout",
      {
        data: data,
        signature: signature,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((data) => {
      const paymentURL = data.request.res.responseUrl;
      res.status(200).send({ paymentURL: paymentURL });
    })
    .catch((error) =>
      res.status(404).send(
        JSON.stringify({
          errorCode: error.code,
          errorNo: error.errno,
        })
      )
    );
};

export const callbackResult = async (
  req: express.Request,
  res: express.Response
) => {
  const encodedData = req.body.data;
  const reqSignature = req.body.signature;

  const decodedData = Buffer.from(encodedData, "base64").toString("utf-8");

  const { payment_id, status, info, order_id, amount, description } =
    JSON.parse(decodedData);

  const date = moment.tz(Date.now(), "Europe/Kyiv").toString();

  console.log("time", date);

  const origSig = str_to_sign(
    process.env.LIQPAY_PRIVATE_KEY +
      encodedData +
      process.env.LIQPAY_PRIVATE_KEY
  );

  if (reqSignature === origSig && status === "success") {
    console.log("PAYMENT SUCCESS!!!");

    console.log(info);
    const orderParams = {
      userID: JSON.parse(info).userID,
      phoneNumber: JSON.parse(info).phone,
      products: JSON.parse(info).products,
      userFullName: JSON.parse(info).name,
      shippingAddress: JSON.parse(info).shippingAddress,
      deliveryTime: JSON.parse(info).deliveryTime,
      comment: JSON.parse(info).comment,
      description: description,
      payment: {
        status: status === "success",
        bonuses: JSON.parse(info).bonuses,
        amount: JSON.parse(info).amountWoDeliveryPrice,
        deliveryPrice: JSON.parse(info).deliveryPrice,
        liqpayPaymentID: payment_id,
      },
      createdAt: date,
    };

    try {
      const result = orderParams.products.map(async (pObject: any) => {
        const product = await getProductById(pObject.product_id)
          .populate([
            "categoryID",
            "variants.ingredients.ingredient.id",
            "variants.ingredients.ingredient.variantID",
          ])
          .exec();

        const tmp = product.variants.map((pVariant: any) => {
          if (pVariant.id === pObject.productVariant.id) {
            pVariant.ingredients.map(async (ing: any) => {
              const updateCount =
                Number(ing.ingredient.variantID.count) -
                Number(ing.count) * Number(pObject.count);

              const updatedIngVariant = await updateIngredientVariantById(
                ing.ingredient.variantID.id,
                {
                  count: updateCount,
                }
              );
            });
          }
        });
      });

      const order = await createOrder({
        ...orderParams,
      });

      console.log("order", order);

      const user = await updateUserById(orderParams.userID, {
        promo: {
          ordersSummary: Math.round(
            (order.userID as any).promo.ordersSummary +
              Number(orderParams.payment.amount)
          ),
          bonuses: Math.round(
            (Number(orderParams.payment.amount) / 100) *
              (order.userID as any).promo.bonusesPercent +
              (order.userID as any).promo.bonuses -
              Number(orderParams.payment.bonuses)
          ),
          bonusesPercent:
            (order.userID as any).promo.ordersSummary +
              Number(orderParams.payment.amount) <
            10000
              ? 2
              : 4,
        },
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "clumbaeshop@gmail.com",
          pass: process.env.NODEMAILER_PASSWORD,
        },
      });

      const att = order.products.map((product, index) => {
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
        to: ["clumbaeshop@gmail.com"],
        subject: `Нове замовлення №${order.payment.liqpayPaymentID}`,
        html: `${order.products.map((product, index) => {
          return `
                    <tr>
                    <td style="height: 125px; width: 125px; max-height: 125px; max-width: 125px; padding-right: 12px"><img style="width: 100%; height: 100%" src="cid:${
                      att[index].cid
                    }" alt="${att[index].filename}" /></td>
                    <td>
                    <p>Назва товару: ${(product.product_id as any).title}</p>
                    <p>Варіант товару: ${product.productVariant.title}</p>
                    <p>Кількість товару: ${product.count}</p>
                    </td>
                    </tr>
                    <hr style="width: 100%; display: block"/>
                    `;
        })}`,
        attachments: [...att],
      };

      console.log("attachments", att);

      transporter.sendMail(mailOptions).catch((error) => console.log(error));
      console.log("ORDER SUCCESS!!!");

      return res.status(200).json(order);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }

    return res.sendStatus(200);
  }
};
