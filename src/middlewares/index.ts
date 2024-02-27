import express from "express";
import { get, merge } from "lodash";
import fs from "fs";
import { getUserBySessionToken } from "../database/schemes/users";
import sharp from "sharp";
import path from "path";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  const currentUserID = get(req, "identity._id") as string;

  if (!currentUserID) {
    return res.sendStatus(400);
  }

  if (currentUserID.toString() !== id) {
    return res.sendStatus(400);
  }

  return next();
};
export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["USER-AUTH"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const uploadOImage = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { isNewImage } = req.body;

  if (isNewImage) {
    const image = (req.files as any).image;

    console.log("image", image);
    const fileName = `image-${Date.now()}.webp`;
    await sharp(image.data)
      .toFormat("webp")
      .webp({ quality: 70 })
      .toFile(path.resolve(__dirname, `../../uploads/${fileName}`));

    image.name = fileName;
    next();
  } else {
    next();
  }
};

export const minifyImage = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { isNewImage } = req.body;

  if (isNewImage) {
    const image = (req.files as any).image;

    console.log("minifimg", image);
    await sharp(image.data)
      .webp({ quality: 60 })
      .resize(500, 500)
      .toFile(path.resolve(__dirname, `../../uploads/m_${image.name}`));

    next();
  } else {
    next();
  }
};
