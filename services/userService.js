import bcrypt from "bcryptjs";
import User from "../models/users.js";
import gravatar from 'gravatar';
import * as fs from "node:fs/promises";
import * as path from "node:path";

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
    avatarURL: gravatar.url(email,{
      s: '200',
      r: 'pg',
    })
  });
  return newUser;
}

async function updateToken(id, token) {
  await User.update({ token }, { where: { id } });
}

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

async function changeAvatarURL(file, id) {
  let avatarURL = null;
  if(file) {
    const newPath = path.resolve("public", "avatars", file.filename);
    await fs.rename(file.path, newPath);
    avatarURL = path.join("public", "avatars", file.filename);
  }
  await User.update({avatarURL}, {where: {id}})
}

export default {
  findByEmail,
  findById,
  createUser,
  updateToken,
  comparePassword,
  changeAvatarURL
};

