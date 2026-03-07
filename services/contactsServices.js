import Contact from "../models/contact.js";

async function listContacts(ownerId) {
  const contacts = await Contact.findAll({ where: { owner: ownerId } });
  return contacts;
}

async function getContactById(contactId, ownerId) {
  const contact = await Contact.findOne({
    where: { id: contactId, owner: ownerId },
  });
  return contact;
}

async function removeContact(contactId, ownerId) {
  const deleted = await Contact.destroy({
    where: { id: contactId, owner: ownerId },
  });
  return deleted;
}

async function addContact(name, email, phone, ownerId) {
  const newContact = await Contact.create({
    name,
    email,
    phone,
    owner: ownerId,
  });
  return newContact;
}

async function updateContact(id, body, ownerId) {
  const [updated] = await Contact.update(body, {
    where: { id, owner: ownerId },
  });

  if (updated === 0) {
    return null;
  }
  return await Contact.findOne({ where: { id, owner: ownerId } });
}

async function updateStatusContact(id, body, ownerId) {
  const { favorite } = body;
  const [updated] = await Contact.update(
    { favorite },
    {
      where: { id, owner: ownerId },
    }
  );

  if (updated === 0) {
    return null;
  }
  return await Contact.findOne({ where: { id, owner: ownerId } });
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
