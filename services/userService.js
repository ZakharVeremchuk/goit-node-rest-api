import bcrypt from "bcryptjs";
import User from "../models/users.js";
import { nanoid } from "nanoid";
import "dotenv/config";
import sendEmail from "../helpers/sendEmail.js";

const { BASE_URL } = process.env;

async function sendVerifyEmail(email, verificationToken) {
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/auth/verify/${verificationToken}" target="_blank">Click verify email</a>`,
  };
  await sendEmail(verifyEmail);
}

async function findByEmail(email) {
  return await User.findOne({ where: { email } });
}

async function findByVerificationToken(verificationToken) {
  return await User.findOne({ where: { verificationToken } });
}

async function updateVerificationToken(user) {
  return await user.update({verify: true, verificationToken: null})
}

async function findById(id) {
  return await User.findByPk(id);
}

async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const newUser = await User.create({
    email,
    password: hashedPassword,
    verificationToken: verificationToken
  });

  await sendVerifyEmail(newUser.email, verificationToken);

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
  findByVerificationToken,
  updateVerificationToken,
  sendVerifyEmail
};
