import express from "express";
import {getDeliveryPrice, updateById} from "../controllers/delivery";

export default (router: express.Router) => {
    router.post("/deliveryPrice", updateById);
    router.get("/deliveryPrice", getDeliveryPrice);
};
