import express from "express";
import {callbackResult, createPaymentURL, result} from "../controllers/payment";

export default (router: express.Router) => {
    router.post('/result', result);
    router.post('/payment', createPaymentURL);
    router.post('/payment/callback', callbackResult);
}