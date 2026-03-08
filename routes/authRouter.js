import express from "express";
import {
  register,
  login,
  logout,
  current,
  avatars,
} from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", auth, logout);
authRouter.get("/current", auth, current);
authRouter.patch("/avatars", auth, upload.single("avatar"), avatars);

export default authRouter;