const uuid = require('uuid').v4;

const createUser = async (fn, data) => {
  const user = {
    email: (data && data.email) || `${uuid()}@test.com`,
    givenName: (data && data.givenName) || uuid(),
    familyName: (data && data.familyName) || uuid(),
  };
  const result = await fn.post('/user').send(user);
  return result.body;
};

module.exports = { createUser };
