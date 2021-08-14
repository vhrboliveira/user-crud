const Joi = require('joi');

const getDeletePatchParamsUserSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const searchQueryUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  givenName: Joi.string().max(256).optional(),
  familyName: Joi.string().max(256).optional(),
}).min(1);

const patchBodyUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  givenName: Joi.string().max(256).optional(),
  familyName: Joi.string().max(256).optional(),
}).min(1);

const createBodyUserSchema = Joi.object({
  email: Joi.string().email().required(),
  givenName: Joi.string().max(256).required(),
  familyName: Joi.string().max(256).required(),
});

module.exports = {
  getDeletePatchParamsUserSchema,
  searchQueryUserSchema,
  patchBodyUserSchema,
  createBodyUserSchema,
};
