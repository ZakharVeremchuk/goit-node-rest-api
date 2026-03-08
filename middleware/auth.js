import jwt from "jsonwebtoken";
import User from "../models/users.js";
import HttpError from "../helpers/HttpError.js";

const secret = "your-secret-key";

export const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw HttpError(401, "Not authorized");
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, secret);
    const user = await User.findByPk(id);

    if (!user || user.token !== token) {
      throw HttpError(401, "Not authorized");
    }

    req.user = user;
    next();
  } catch (error) {
    throw HttpError(401, "Not authorized");
  }
};

