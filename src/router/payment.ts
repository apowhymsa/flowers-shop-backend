import express from "express";
import {
  callbackResult,
  cancel,
  createPaymentURL,
  error,
  result,
  success,
  tempPayment,
  tempPaymentPayed,
} from "../controllers/payment";

export default (router: express.Router) => {
  router.post("/result", result);
  router.post("/payment", createPaymentURL);
  router.post("/payment/callback", callbackResult);
  router.post("/payment/temp", tempPayment);
  router.post("/payment/tempPayed", tempPaymentPayed);
  router.post("/success", success);
  router.post("/error", error);
  router.post("/cancel", cancel);
};
