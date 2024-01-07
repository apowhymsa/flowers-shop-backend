import express from "express";
import { startMailing } from "../helpers";

export default (router: express.Router) => {
  router.post("/startMailing", startMailing);
};
