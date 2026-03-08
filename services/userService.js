import bcrypt from "bcryptjs";
import User from "../models/users.js";

async function findByEmail(email) {
  return await User.findOne({ where: { email } });
}

async function findById(id) {
  return await User.findByPk(id);
}

async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email,
    password: hashedPassword,
  });
  return newUser;
}

async function updateToken(id, token) {
  await User.update({ token }, { where: { id } });
}

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export default {
  findByEmail,
  findById,
  createUser,
  updateToken,
  comparePassword,
};

