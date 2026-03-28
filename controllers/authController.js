import jwt from "jsonwebtoken";
import userService from "../services/userService.js";
import HttpError from "../helpers/HttpError.js";
import { registerSchema, loginSchema, emailSchema } from "../schemas/authSchemas.js";

const secret = "your-secret-key";

export const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { email, password } = req.body;
    const existingUser = await userService.findByEmail(email);

    if (existingUser) {
      throw HttpError(409, "Email in use");
    }

    const newUser = await userService.createUser(email, password);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verify = async(req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await userService.findByVerificationToken(verificationToken);
    if(!user) throw HttpError(404, "User not found")
      
    await userService.updateVerificationToken(user);

    res.json({
      message: "Verification successful"
    })
  } catch (error) {
    next(error);
  }

}

export const resendVerify = async(req, res, next) => {
  try {
    const { error } = emailSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const {email} = req.body;

    const user = await userService.findByEmail(email);
    if(!user) throw HttpError(404, "User not found");
    if(user.verify) throw HttpError(400, "User already verified")

    await userService.sendVerifyEmail(user.email, user.verificationToken);

    res.json({
      message: "Resend email successfully"
    })

  } catch (error) {
    next(error);
  }
}

export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { email, password } = req.body;
    const user = await userService.findByEmail(email);

    if (!user) throw HttpError(401, "Email or password is wrong");
    if(!user.verify) throw HttpError(401, "Email not verified");

    const isValidPassword = await userService.comparePassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });
    await userService.updateToken(user.id, token);

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    await userService.updateToken(id, null);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

