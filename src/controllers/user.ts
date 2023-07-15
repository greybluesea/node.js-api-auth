import express from "express";
import {
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from "../db/schema";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);
    return res.json(deletedUser);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const updateUserName = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const existingUser = await getUserById(id);
    if (!existingUser || !id || !username) return res.sendStatus(400);

    existingUser.username = username;
    await existingUser.save();

    return res.status(200).json(existingUser).end();
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const user = req.body;
    const existingUser = await getUserById(id);
    if (!existingUser || !id || !user.username || !user.email)
      return res.sendStatus(400);

    const updatedUser = await updateUserById(id, user);
    return res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
