import express from "express";
import { createUser, getUserByEmail } from "../db/schema";
import { getRandom, authenticate } from "../crypto";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) return res.sendStatus(400);

    const salt = getRandom();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authenticate(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email);

    if (!user) return res.sendStatus(400);

    const inferredHash = authenticate(user.authentication.salt, password);

    if (user.authentication.password !== inferredHash)
      return res.sendStatus(403);

    const salt = getRandom();
    user.authentication.sessionToken = authenticate(salt, user._id.toString());

    await user.save();

    res.cookie("sessionToken", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
