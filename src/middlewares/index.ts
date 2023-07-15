import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/schema";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["sessionToken"];

    if (!sessionToken) return res.sendStatus(403);

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) return res.sendStatus(403);

    merge(req, { identity: existingUser });

    return next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const isOwn = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId || !id || currentUserId.toString() !== id)
      return res.sendStatus(403);

    return next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
