import HttpError from "../helpers/HttpError.js";
import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  const ownerId = req.user.id;
  const contacts = await contactsService.listContacts(ownerId);
  res.json(contacts);
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;
    const contact = await contactsService.getContactById(id, ownerId);
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
    const ownerId = req.user.id;
    const contact = await contactsService.removeContact(id, ownerId);
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
    const ownerId = req.user.id;
    const contact = await contactsService.addContact(name, email, phone, ownerId);
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
    const ownerId = req.user.id;
    const updatedContact = await contactsService.updateContact(id, req.body, ownerId);
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
    const ownerId = req.user.id;

    if (favorite === undefined) {
      throw HttpError(400, "Missing field favorite");
    }

    const contact = await contactsService.updateStatusContact(id, { favorite }, ownerId);
    if (!contact) {
      throw HttpError(404, "Not Found");
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
};

