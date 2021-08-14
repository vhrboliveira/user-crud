const request = require('supertest');
const mongoose = require('mongoose');
const uuid = require('uuid').v4;
const { connect, disconnect } = require('../database/Connection');
const { app } = require('../app');

const { createUser } = require('./utils/createUsers');

describe('Users', () => {
  beforeAll(async () => {
    connect();
    const { connection } = mongoose;
    const { User } = connection.models;
    await User.deleteMany();
  });

  afterAll(async () => {
    disconnect();
  });

  describe('GET /', () => {
    beforeEach(async () => {
      const { connection } = mongoose;
      const { User } = connection.models;
      await User.deleteMany();
    });

    it('List all users', async () => {
      const user = await createUser(request(app));
      const user2 = await createUser(request(app), { email: 'user2@test.com' });

      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body.users).toBeDefined();
      expect(response.body.users.length).toBe(2);
      expect(response.body.users[0].email).toBe(user.email);
      expect(response.body.users[1].email).toBe(user2.email);
      expect(response.body.users[0].id).toBeDefined();
      expect(response.body.users[1].id).toBeDefined();
      expect(response.body.users[0].createdAt).toBeDefined();
      expect(response.body.users[1].createdAt).toBeDefined();
      expect(response.body.users[0].updatedAt).toBeDefined();
      expect(response.body.users[1].updatedAt).toBeDefined();
    });

    it('There is no user to list', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body.users).toBeDefined();
      expect(response.body.users.length).toBe(0);
    });
  });

  describe('GET /user', () => {
    beforeEach(async () => {
      const { connection } = mongoose;
      const { User } = connection.models;
      await User.deleteMany();
    });

    it('Missing query parameters (at least one is necessary)', async () => {
      const error = 'Validation Error: "value" must have at least 1 key';

      const response = await request(app).get('/user');

      expect(response.status).toBe(400);
      expect(response.error).toBeDefined();
      expect(response.body.error).toBe(error);
    });

    it('Search user by the email', async () => {
      const user = await createUser(request(app));

      const response = await request(app).get('/user').query({
        email: user.email,
      });

      expect(response.status).toBe(200);
      expect(response.body.users.length).toBe(1);
      expect(response.body.users[0].email).toBe(user.email);
      expect(response.body.users[0].id).toBeDefined();
      expect(response.body.users[0].givenName).toBeDefined();
      expect(response.body.users[0].familyName).toBeDefined();
      expect(response.body.users[0].createdAt).toBeDefined();
      expect(response.body.users[0].updatedAt).toBeDefined();
    });

    it('Search user by the given name', async () => {
      const user = await createUser(request(app));

      const response = await request(app).get('/user').query({
        givenName: user.givenName,
      });

      expect(response.status).toBe(200);
      expect(response.body.users.length).toBe(1);
      expect(response.body.users[0].givenName).toBe(user.givenName);
      expect(response.body.users[0].id).toBeDefined();
      expect(response.body.users[0].email).toBeDefined();
      expect(response.body.users[0].familyName).toBeDefined();
      expect(response.body.users[0].createdAt).toBeDefined();
      expect(response.body.users[0].updatedAt).toBeDefined();
    });

    it('Search user by the family name', async () => {
      const user = await createUser(request(app));

      const response = await request(app).get('/user').query({
        familyName: user.familyName,
      });

      expect(response.status).toBe(200);
      expect(response.body.users.length).toBe(1);
      expect(response.body.users[0].familyName).toBe(user.familyName);
      expect(response.body.users[0].id).toBeDefined();
      expect(response.body.users[0].email).toBeDefined();
      expect(response.body.users[0].givenName).toBeDefined();
      expect(response.body.users[0].createdAt).toBeDefined();
      expect(response.body.users[0].updatedAt).toBeDefined();
    });

    it('Search user by the email, given name and last name', async () => {
      const user = await createUser(request(app));

      const response = await request(app).get('/user').query({
        email: user.email,
        givenName: user.givenName,
        familyName: user.familyName,
      });

      expect(response.status).toBe(200);
      expect(response.body.users.length).toBe(1);
      expect(response.body.users[0].email).toBe(user.email);
      expect(response.body.users[0].givenName).toBe(user.givenName);
      expect(response.body.users[0].familyName).toBe(user.familyName);
      expect(response.body.users[0].id).toBeDefined();
      expect(response.body.users[0].createdAt).toBeDefined();
      expect(response.body.users[0].updatedAt).toBeDefined();
    });

    it('User not found for the search params', async () => {
      const error = 'User not found!';
      const user = {
        email: 'test@test.com',
        givenName: 'John',
        familyName: 'Doe',
      };

      const response = await request(app).get('/user').query(user);

      expect(response.status).toBe(404);
      expect(response.error).toBeDefined();
      expect(response.body.error).toBe(error);
    });
  });

  describe('POST /user', () => {
    beforeEach(async () => {
      const { connection } = mongoose;
      const { User } = connection.models;
      await User.deleteMany();
    });

    it('Create a new user', async () => {
      const user = {
        email: 'user@test.com',
        givenName: 'John',
        familyName: 'Doen',
      };

      const response = await request(app).post('/user').send(user);

      expect(response.status).toBe(201);
      expect(response.body.email).toBe(user.email);
      expect(response.body.givenName).toBe(user.givenName);
      expect(response.body.familyName).toBe(user.familyName);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    it('Missing email', async () => {
      const error = 'Validation Error: "email" is required';
      const user = { givenName: 'John', familyName: 'Doe' };

      const response = await request(app).post('/user').send(user);

      expect(response.status).toBe(400);
      expect(response.error).toBeDefined();
      expect(response.body.error).toBe(error);
    });

    it('Missing given name', async () => {
      const error = 'Validation Error: "givenName" is required';
      const user = { email: 'user@test.com', familyName: 'John' };

      const response = await request(app).post('/user').send(user);

      expect(response.status).toBe(400);
      expect(response.error).toBeDefined();
      expect(response.body.error).toBe(error);
    });

    it('Missing family name', async () => {
      const error = 'Validation Error: "familyName" is required';
      const user = { email: 'user@test.com', givenName: 'John' };

      const response = await request(app).post('/user').send(user);

      expect(response.status).toBe(400);
      expect(response.error).toBeDefined();
      expect(response.body.error).toBe(error);
    });
  });

  describe('GET /user/{id}', () => {
    beforeEach(async () => {
      const { connection } = mongoose;
      const { User } = connection.models;
      await User.deleteMany();
    });

    it('Wrong id params type', async () => {
      const error = 'Validation Error: "id" must be a valid GUID';
      const id = 'someFakeId';

      const response = await request(app).get(`/user/${id}`);

      expect(response.status).toBe(400);
      expect(response.error).toBeDefined();
      expect(response.body.error).toBe(error);
    });

    it('Get the user', async () => {
      const user = await createUser(request(app));

      const response = await request(app).get(`/user/${user.id}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.id).toBe(user.id);
      expect(response.body.user.email).toBeDefined();
      expect(response.body.user.givenName).toBeDefined();
      expect(response.body.user.familyName).toBeDefined();
      expect(response.body.user.createdAt).toBeDefined();
      expect(response.body.user.updatedAt).toBeDefined();
    });

    it('User not found', async () => {
      const error = 'User not found!';
      const id = uuid();

      const response = await request(app).get(`/user/${id}`);

      expect(response.status).toBe(404);
      expect(response.error).toBeDefined();
      expect(response.body.error).toBe(error);
    });
  });

  describe('DELETE /user/{id}', () => {
    beforeEach(async () => {
      const { connection } = mongoose;
      const { User } = connection.models;
      await User.deleteMany();
    });

    it('Wrong id params type', async () => {
      const error = 'Validation Error: "id" must be a valid GUID';
      const id = 'someFakeId';

      const response = await request(app).delete(`/user/${id}`);

      expect(response.status).toBe(400);
      expect(response.error).toBeDefined();
      expect(response.body.error).toBe(error);
    });

    it('Delete a user', async () => {
      const error = 'User not found!';
      const user = await createUser(request(app));

      const response = await request(app).delete(`/user/${user.id}`);
      const dataUser = await request(app).get(`/user/${user.id}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(dataUser.status).toBe(404);
      expect(dataUser.error).toBeDefined();
      expect(dataUser.body.error).toBe(error);
    });
  });

  describe('PATCH /user/{id}', () => {
    beforeEach(async () => {
      const { connection } = mongoose;
      const { User } = connection.models;
      await User.deleteMany();
    });

    it('Wrong id params type', async () => {
      const error = 'Validation Error: "id" must be a valid GUID';
      const id = 'someFakeId';

      const response = await request(app).patch(`/user/${id}`).send({
        email: 'test@test.com',
      });

      expect(response.status).toBe(400);
      expect(response.error).toBeDefined();
      expect(response.body.error).toBe(error);
    });

    it('Missing query parameters (at least one is necessary)', async () => {
      const error = 'Validation Error: "value" must have at least 1 key';
      const id = uuid();

      const response = await request(app).patch(`/user/${id}`).send({});

      expect(response.status).toBe(400);
      expect(response.error).toBeDefined();
      expect(response.body.error).toBe(error);
    });

    it('User not found', async () => {
      const error = 'User not found!';
      const id = uuid();

      const response = await request(app).patch(`/user/${id}`).send({
        email: 'test@test.com',
      });

      expect(response.status).toBe(404);
      expect(response.error).toBeDefined();
      expect(response.body.error).toBe(error);
    });

    it('Update user given name', async () => {
      const user = await createUser(request(app));
      const newGivenName = 'User Test';

      const response = await request(app).patch(`/user/${user.id}`).send({
        givenName: newGivenName,
      });

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.givenName).toBe(newGivenName);
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.email).toBeDefined();
      expect(response.body.user.familyName).toBeDefined();
      expect(response.body.user.createdAt).toBeDefined();
      expect(response.body.user.updatedAt).toBeDefined();
    });

    it('Update user information: email, given name and family name', async () => {
      const user = await createUser(request(app));
      const newData = {
        email: 'test@test.com',
        givenName: 'John',
        familyName: 'Doe',
      };

      const response = await request(app).patch(`/user/${user.id}`).send(newData);

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(newData.email);
      expect(response.body.user.givenName).toBe(newData.givenName);
      expect(response.body.user.familyName).toBe(newData.familyName);
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.createdAt).toBeDefined();
      expect(response.body.user.updatedAt).toBeDefined();
    });
  });
});
