import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Contact from "../models/contact.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const contactsPath = path.join(__dirname, "..", "db", "contacts.json");

async function listContacts() {
  const contacts = await Contact.findAll();
  return contacts;
}

async function getContactById(id) {
  const contacts = await Contact.findByPk(id);
  return contacts;
}

async function removeContact(contactId) {
  const deleted = await Contact.destroy({
    where: { id: contactId },
  });

  return deleted;
}

async function addContact(name, email, phone) {
  const newContact = await Contact.create({
    name,
    email,
    phone,
  });
  return newContact;
}

async function updateContact(id, body) {
  const [updated] = await Contact.update(body, {
    where: { id },
  });

  if (updated == 0) {
    return null;
  }
  return await Contact.findByPk(id);
}

async function updateStatusContact(id, body) {
  const { favorite } = body;
  const [updated] = await Contact.update(
    { favorite },
    {
      where: { id },
    },
  );

  if (updated == 0) {
    return null;
  }
  return await Contact.findByPk(id);
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
};
