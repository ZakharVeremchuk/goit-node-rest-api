import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const contactsPath = path.join(__dirname, "..", "db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.log(err.message);
    return [];
  }
}

async function writeContactsToFile(data) {
  try {
    await fs.writeFile(contactsPath, data, "utf-8");
    console.log("File written successfully");
  } catch (err) {
    console.error("Error writing file:", err);
  }
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId) ?? null;
}

async function removeContact(contactId) {
  const contact = await getContactById(contactId);

  if (!contact) {
    return null;
  }

  const contacts = await listContacts();
  const updatedContacts = contacts.filter(
    (contact) => contact.id !== contactId,
  );
  writeContactsToFile(JSON.stringify(updatedContacts));

  return contact;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: crypto.randomUUID(), name, email, phone };

  contacts.push(newContact);
  await writeContactsToFile(JSON.stringify(contacts, null, 2));

  return newContact;
}

async function updateContact(id, body) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return null;
  }

  contacts[index] = { ...contacts[index], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
};
