const ErrorHandler = require('./ErrorHandler');

const formatPatchData = async (data) => {
  const newData = {};
  const fields = ['email', 'givenName', 'familyName'];

  fields.forEach((field) => {
    if (data[field]) {
      newData[field] = data[field];
    }
  });
  newData.updatedAt = Date.now();

  return newData;
};

const formatSearchData = async (data) => {
  const newData = {};
  const fields = ['email', 'givenName', 'familyName'];

  fields.forEach((field) => {
    if (data[field]) {
      newData[field] = {
        $regex: data[field],
        $options: 'i',
      };
    }
  });

  return newData;
};

const validateRequest = async (request, joiSchemas) => {
  try {
    if (joiSchemas.body) {
      await joiSchemas.body.validateAsync(request.body);
    }
    if (joiSchemas.query) {
      await joiSchemas.query.validateAsync(request.query);
    }
    if (joiSchemas.params) {
      await joiSchemas.params.validateAsync(request.params);
    }
  } catch (validationError) {
    if (validationError.message) {
      throw new ErrorHandler(`Validation Error: ${validationError.message}`, 400);
    }
  }
};

module.exports = {
  formatPatchData,
  formatSearchData,
  validateRequest,
};
