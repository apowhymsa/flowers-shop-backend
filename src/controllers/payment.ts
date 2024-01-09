import crypto from "crypto";
import express from "express";
import axios from "axios";
import { createOrder } from "../database/schemes/orders";
import moment from "moment-timezone";
import {
  getProductById,
  updateProductById,
} from "../database/schemes/products";
import { updateIngredientVariantById } from "../database/schemes/ingredientVariants";

const str_to_sign = function str_to_sign(str: string) {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }

  const sha1 = crypto.createHash("sha1");
  sha1.update(str);
  return sha1.digest("base64");
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
    }`,
  );
};
export const createPaymentURL = async (
  req: express.Request,
  res: express.Response,
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
      products: additionalData.products.map((product: any) => {
        return {
          count: product.count,
          product_id: product.product_id,
          productVariant: product.productVariant,
        };
      }),
      phone: additionalData.phone,
      shippingAddress: additionalData.shippingAddress,
      name: additionalData.name,
    }),
    public_key: process.env.LIQPAY_PUBLIC_KEY,
    // private_key: process.env.LIQPAY_PRIVATE_KEY,
    server_url: "https://154d-178-213-6-237.ngrok-free.app/payment/callback",
    result_url: "https://154d-178-213-6-237.ngrok-free.app/result",
  };

  const data = Buffer.from(JSON.stringify(params)).toString("base64");
  const signature = str_to_sign(
    process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY,
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
      },
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
        }),
      ),
    );
};

export const callbackResult = async (
  req: express.Request,
  res: express.Response,
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
      process.env.LIQPAY_PRIVATE_KEY,
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
      description: description,
      payment: {
        status: status === "success",
        amount: amount,
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
                },
              );
            });
          }
        });
      });

      const order = await createOrder({
        ...orderParams,
      });

      console.log("ORDER SUCCESS!!!");
      return res.status(200).json(order);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }

    return res.sendStatus(200);
  }
};
