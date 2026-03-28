import bcrypt from "bcryptjs";
import User from "../models/users.js";
import { nanoid } from "nanoid";
import "dotenv/config";
import sendEmail from "../helpers/sendEmail.js";

const { BASE_URL } = process.env;

async function findByEmail(email) {
  return await User.findOne({ where: { email } });
}

async function findByVerificationCode(verificationCode) {
  return await User.findOne({ where: { verificationCode } });
}

async function updateVerificationToken(user) {
  return await user.update({verify: true, verificationCode: ''})
}

async function findById(id) {
  return await User.findByPk(id);
}

async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = nanoid();
  const newUser = await User.create({
    email,
    password: hashedPassword,
    verificationCode: verificationCode
  });

  const verifyEmail = {
    to: newUser.email,
    subject: "Verify email",
    html: `<a href="${BASE_URL}/api/auth/verify/${verificationCode}" target="_blank" >Click verify email</a>`,
  };
  await sendEmail(verifyEmail);

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
  findByVerificationCode,
  updateVerificationToken
};
