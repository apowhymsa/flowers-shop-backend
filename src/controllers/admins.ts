import {
  createAdmin,
  getAdminByEmail,
  getAdminById,
  updateAdminById,
} from "../database/schemes/admins";
import express from "express";
import { authentication, random } from "../helpers/index";
import jwt from "jsonwebtoken";
import { sendEmailText } from "../helpers/sendEmailText";
import cookie from "cookie";

const authCodes: { [id: string]: string } = {};

export const create = async (
  request: express.Request,
  response: express.Response
) => {
  const { email, password } = request.body;
  const salt = random();

  const pwd = authentication(salt, password);
  const token = jwt.sign(
    {
      email,
      password: pwd,
    },
    "secret"
  );

  const admin = await createAdmin({
    email,
    authentication: {
      password: pwd,
      salt,
      accessToken: token,
    },
  });

  response.json({ admin });
};

export const adminBeginAuth = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  const { email, password } = request.body;
  if (!email || !password)
    return response
      .status(400)
      .json({ msg: "Недостатньо даних для виконання запиту" });

  const admin = await getAdminByEmail(email).select(
    "+authentication.salt +authentication.password"
  );

  if (!admin) {
    return response.status(400).json({ msg: "Невірний email" });
  }

  const expectedHash = authentication(admin.authentication.salt, password);
  if (admin.authentication.password !== expectedHash) {
    return response.status(400).json({ msg: "Невірний пароль" });
  }

  const randomCodeID = random();
  const randomCode = Math.random().toString().substr(2, 4);
  console.log(randomCode);

  sendEmailText(
    email,
    `Код підтвердження входу в обліковий запис - ${email}`,
    `Ваш код: ${randomCode}`
  );
  authCodes[randomCodeID] = randomCode;

  setTimeout(() => {
    console.log("authCodes deleted");
    delete authCodes[randomCodeID];
  }, 1000 * 60 * 2);

  return response.json({ adminID: admin.id, codeID: randomCodeID });
};

export const adminEndAuth = async (
  request: express.Request,
  response: express.Response
) => {
  const { code, adminID, codeID } = request.body;

  if (!code || !adminID || !codeID)
    return response
      .status(400)
      .json({ msg: "Недостатньо даних для виконання запиту" });
  if (!authCodes[codeID])
    return response.status(400).json({
      msg: "Термін дії коду закінчився, виконайте авторизацію ще раз",
    });
  if (authCodes[codeID] !== code)
    return response.status(400).json({ msg: "Код авторизації невірний" });
  let admin = null;
  try {
    admin = await getAdminById(adminID).select("+authentication.accessToken");
  } catch (error) {
    return response.sendStatus(500);
  }

  delete authCodes[codeID];

  response.setHeader(
    "Set-Cookie",
    cookie.serialize("token", admin.authentication.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 12,
      path: "/",
      sameSite: "strict",
    })
  );

  return response.status(200).json({
    msg: "Успішна авторизація в обліковий запис адміністратора",
    admin: adminID,
    // accessToken: admin.authentication.accessToken,
  });
};

export const logout = async (
  request: express.Request,
  response: express.Response
) => {
  console.log(request.cookies);

  response.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
      sameSite: "strict",
    })
  );

  response.sendStatus(200);
};

export const logged = async (
  request: express.Request,
  response: express.Response
) => {
  return response.sendStatus(202);
};
