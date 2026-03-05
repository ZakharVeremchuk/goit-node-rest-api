import User from "../models/users";


async function checkIfExist(email) {
   return await User.findOne(email);
}

async function save(email, password) {
    const newUser = new User(email, password);
    await newUser.save();
}

export default {
  checkIfExist,
  save
}