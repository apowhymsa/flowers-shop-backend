import express from "express";
import {
  adminBeginAuth,
  adminEndAuth,
  create,
  logged,
  logout,
} from "../controllers/admins";
import { isAuthenticated, isLogged } from "../middlewares";

export default (router: express.Router) => {
  router.post("/admin/authBegin", adminBeginAuth);
  router.post("/admin/authEnd", adminEndAuth);
  router.post("/admin/create", create);
  router.post("/admin/logout", logout);
  router.get("/admin/isLogged", isLogged, logged);
};
