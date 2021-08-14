const User = require('../models/User');
const {
  validateRequest,
  formatPatchData,
  formatSearchData,
} = require('../utils/userUtils');

const {
  getDeletePatchParamsUserSchema,
  searchQueryUserSchema,
  patchBodyUserSchema,
  createBodyUserSchema,
} = require('../models/UserJoiValidation');

const EXCLUDE_FIELDS = ['-_id', '-__v'];

class UserController {
  async show(request, response) {
    const users = await User.find().select(EXCLUDE_FIELDS) || [];

    return response.status(200).json({ users });
  }

  async search(request, response) {
    try {
      await validateRequest(request, { query: searchQueryUserSchema });

      const searchObj = await formatSearchData(request.query);
      const users = await User.find({ ...searchObj })
        .select(EXCLUDE_FIELDS);
      if (!users || users.length === 0) {
        return response.status(404).json({
          error: 'User not found!',
        });
      }

      return response.status(200).json({ users });
    } catch (error) {
      const status = error.status ? error.status : 500;
      return response.status(status).json({
        error: error.message,
      });
    }
  }

  async get(request, response) {
    try {
      await validateRequest(request, { params: getDeletePatchParamsUserSchema });

      const { id } = request.params;
      const user = await User.findOne({ id }).select(EXCLUDE_FIELDS);
      if (!user) {
        return response.status(404).json({
          error: 'User not found!',
        });
      }

      return response.status(200).json({ user });
    } catch (error) {
      const status = error.status ? error.status : 500;
      return response.status(status).json({
        error: error.message,
      });
    }
  }

  async delete(request, response) {
    try {
      await validateRequest(request, {
        params: getDeletePatchParamsUserSchema,
      });

      const { id } = request.params;
      await User.deleteOne({ id });

      return response.status(200).json({ status: 'ok' });
    } catch (error) {
      const status = error.status ? error.status : 500;
      return response.status(status).json({
        error: error.message,
      });
    }
  }

  async patch(request, response) {
    try {
      await validateRequest(request, {
        params: getDeletePatchParamsUserSchema,
        body: patchBodyUserSchema,
      });

      const { id } = request.params;

      const patchObj = await formatPatchData(request.body);
      await User.updateOne({ id }, { ...patchObj });

      const user = await User.findOne({ id }).select(EXCLUDE_FIELDS);
      if (!user) {
        return response.status(404).json({
          error: 'User not found!',
        });
      }

      return response.status(200).json({ user });
    } catch (error) {
      const status = error.status ? error.status : 500;
      return response.status(status).json({
        error: error.message,
      });
    }
  }

  async create(request, response) {
    try {
      await validateRequest(request, { body: createBodyUserSchema });

      const { email, givenName, familyName } = request.body;
      const user = new User({ email, givenName, familyName });
      await user.save();

      return response.status(201).json({
        id: user.id,
        email,
        givenName,
        familyName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      const status = error.status ? error.status : 500;
      return response.status(status).json({
        error: error.message,
      });
    }
  }
}

module.exports = UserController;
