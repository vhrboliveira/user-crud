const doc = {
  openapi: '3.0.0',
  info: {
    title: 'User CRUD',
    version: '1.0.0',
    description: 'Documentation for the User CRUD API',
  },
  servers: [
    {
      description: 'Development Environment',
      url: 'http://localhost:4000/',
    },
  ],
  paths: {
    '/': {
      get: {
        summary: 'List users',
        description: 'List all users',
        tags: ['user'],
        responses: {
          '200': {
            description: 'Users list returned successfully',
          },
        },
      },
    },
    '/user': {
      get: {
        summary: 'Search users',
        description: 'Search the users by the email, given name and the family name (You can combine one or more options and the API will return all the users that contain the given combination - *At least one field is required*)',
        tags: ['user'],
        parameters: [
          {
            name: 'email',
            in: 'query',
            description: 'The user email',
            required: false,
            schema: {
              type: 'string',
            },
          },
          {
            name: 'givenName',
            in: 'query',
            description: 'The user given name',
            required: false,
            schema: {
              type: 'string',
            },
          },
          {
            name: 'familyName',
            in: 'query',
            description: 'The user family name',
            required: false,
            schema: {
              type: 'string',
            },
          }
        ],
        responses: {
          '200': {
            description: 'Users list returned successfully',
          },
          '400': {
            description: 'Required parameters are missing',
          },
          '404': {
            description: 'User not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
      post: {
        tags: ['user'],
        summary: 'Create user',
        description: 'Creates a new user with a email, given name and family name',
        operationId: 'createUser',
        responses: {
          '201': {
            description: 'User created successfully',
          },
          '400': {
            description: 'Required fields are missing',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
          description: 'Created user object',
        },
      }
    },
    '/user/{id}': {
      get: {
        summary: 'Get user',
        description: 'Get the user by the id',
        tags: ['user'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The user id',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'User returned successfully',
          },
          '400': {
            description: 'Invalid parameter',
          },
          '404': {
            description: 'User not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
      delete: {
        summary: 'Delete user',
        description: 'Delete the user by the id',
        tags: ['user'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The user id',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'User deleted successfully',
          },
          '400': {
            description: 'Invalid parameter',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
      patch: {
        summary: 'Update user',
        description: 'Update the user information: the email, given name and the family name (You can combine one or more fields - *At least one field is required*)',
        tags: ['user'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The user id',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User updated successfully',
          },
          '400': {
            description: 'Invalid id type or Missing parameters (email, givenName, familyName)',
          },
          '404': {
            description: 'User not found',
          },
          '500': {
            description: 'Internal Server Error',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        required: ['email', 'givenName', 'familyName'],
        properties: {
          email: { type: 'string' },
          givenName: { type: 'string' },
          familyName: { type: 'string' },
        },
      },
    },
  },
};

module.exports = doc;
