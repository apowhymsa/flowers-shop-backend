import express from "express";
import {
  createUser,
  getUserByEmail,
  getUserByPhone,
  getUserBySessionToken,
} from "../database/schemes/users";
import { authentication, random } from "../helpers";
import { generatePassword } from "../helpers/passwordBuilder";
import { sendEmailText } from "../helpers/sendEmailText";

export const logout = async (req: express.Request, res: express.Response) => {
  try {
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.sendStatus(404);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    console.log(user.authentication.salt, expectedHash);
    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(401);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    // res.cookie("USER-AUTH", user.authentication.sessionToken, {
    //   domain: "localhost",
    //   path: "/",
    // });

    return res
      .status(200)
      .json({
        _id: user.toObject()._id,
        email: user.toObject().email,
        personals: user.toObject().personals,
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, fullName, phoneNumber, avatar, fromAdminPanel } =
      req.body;

    if (fromAdminPanel) {
      const { promo } = req.body;

      const existingUserByPhone = await getUserByPhone(phoneNumber);
      if (existingUserByPhone) {
        return res.sendStatus(409);
      }

      const existingUserByEmail = await getUserByEmail(email);
      if (existingUserByEmail) {
        return res.sendStatus(410);
      }

      const pwrd = generatePassword();

      const salt = random();
      const user = await createUser({
        email,
        personals: {
          fullName,
          phoneNumber,
          avatar,
        },
        promo,
        authentication: {
          password: authentication(salt, pwrd),
          salt,
        },
      });

      const emailSubject =
        "Пароль від облікового запису у квітковому магазині Clumba";
      const emailText = `Доброго дня, ${user.personals.fullName} 😀.Ваш пароль від облікового запису в квітковому магазину Clumba: ${pwrd}. При необхідності, ви можете змінити його у профілі.`;

      sendEmailText(user.email, emailSubject, emailText);

      return res.status(200).json(user).end();
    }

    if (!email || !password || !fullName || !phoneNumber || !avatar) {
      return res.sendStatus(400);
    }

    const existingUserByPhone = await getUserByPhone(phoneNumber);

    if (existingUserByPhone) {
      return res.sendStatus(409);
    }

    const salt = random();
    const user = await createUser({
      email,
      personals: {
        fullName,
        phoneNumber,
        avatar,
      },
      authentication: {
        password: authentication(salt, password),
        salt,
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
