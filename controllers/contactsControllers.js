import HttpError from "../helpers/HttpError.js";
import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();
  res.json(contacts);
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    if (contact === null) {
      throw HttpError(404, "Not found");
    } else {
      res.json(contact);
    }
  } catch (error) {
     next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.removeContact(id);
    if (contact == null) {
      throw HttpError(404, "Not found");
    } else {
      res.json(contact);
    }
  } catch (error) {
     next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { name, email, phone } = req.body;
    const contact = await contactsService.addContact(name, email, phone);
    res.status(201).json(contact);
  } catch (error) {
     next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const updatedContact = await contactsService.updateContact(id, req.body);
    if (updatedContact == null) {
      throw HttpError(404, "Not Found");
    } else {
      res.status(200).json(updatedContact);
    }
  } catch (error) {
     next(error);
  }
};

export const updateFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    if (favorite === undefined) {
      throw HttpError(400, "Missing field favorite");
    }

    const contact = await contactsService.updateStatusContact(id, { favorite });
    if(!contact) {
      throw HttpError(404, "Not Found");
    }

    res.json(contact);
  } catch (error) {
     next(error);
  }
};
