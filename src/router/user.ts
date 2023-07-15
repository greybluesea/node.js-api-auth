import express from "express";

import {
  deleteUser,
  getAllUsers,
  updateUserName,
  updateUser,
} from "../controllers/user";
import { isAuthenticated, isOwn } from "../middlewares";

export default (router: express.Router) => {
  router.get("/user", isAuthenticated, getAllUsers);
  router.delete("/user/:id", isAuthenticated, isOwn, deleteUser);
  router.patch("/user/:id", isAuthenticated, isOwn, updateUserName);
  router.put("/user/:id", isAuthenticated, isOwn, updateUser);
};
