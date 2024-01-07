import express from "express";
import {
  deleteUserById,
  getUserByEmail,
  getUserById,
  getUsers,
  setCart,
  getUserByPhone,
} from "../database/schemes/users";
import { ProductModel } from "../database/schemes/products";
import { authentication, random } from "../helpers";

export const updateById = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id } = req.params;
  const { data } = req.body;

  if (!id || !data) {
    return res.sendStatus(403);
  }

  try {
    if (!data.isUpdateProfile) {
      const user = await setCart(id, {
        ...data,
      });

      return res.status(200).json(user).end();
    } else {
      console.log("here", data);
      const user = await getUserById(id).select(
        "+authentication.salt +authentication.password",
      );

      if (!user) {
        return res.sendStatus(400);
      }
      const existingUserByPhone = await getUserByPhone(data.phoneNumber);

      if (existingUserByPhone && id !== existingUserByPhone.id) {
        return res.sendStatus(409);
      }

      const existingUserByEmail = await getUserByEmail(data.email);

      if (existingUserByEmail && id !== existingUserByEmail.id) {
        return res.sendStatus(409);
      }

      if (data.password.new && data.password.current) {
        const expectedHash = authentication(
          user.authentication.salt,
          data.password.current,
        );
        console.log(user.authentication.password, " ::: ", expectedHash);
        if (user.authentication.password !== expectedHash) {
          return res.sendStatus(401);
        }
      }

      const salt = random();
      const isChangePassword = data.password.current && data.password.new;

      const newUserData = await setCart(id, {
        email: data.email,
        personals: {
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          avatar: "https://i.pravatar.cc/300",
        },
        authentication: {
          password: isChangePassword
            ? authentication(salt, data.password.new)
            : user.authentication.password,
          salt: isChangePassword ? salt : user.authentication.salt,
        },
      });

      console.log(newUserData);

      return res.status(200).json(newUserData);
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const deleteById = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id } = req.params;
  try {
    const user = await deleteUserById(id);

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const getById = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;

  if (!id) {
    return res.sendStatus(403);
  }

  try {
    const user = await getUserById(id).populate({
      path: "cart.product",
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
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const getAll = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
export const getByEmail = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { email } = req.params;

    const user = await getUserByEmail(email);

    if (!user) {
      return res.sendStatus(400);
    }

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
