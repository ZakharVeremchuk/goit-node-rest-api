import express from "express";
import { register, verify, login, logout, current } from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", auth, logout);
authRouter.get("/current", auth, current);
authRouter.get("/verify/:verificationCode", verify)
export default authRouter;

