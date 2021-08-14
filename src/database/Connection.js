const mongoose = require('mongoose');

let database;

const connect = () => {
  if (database) {
    return;
  }

  // Ideally, we should get this config from environment variables, but
  // for testing purposes, we will create the db based on the NODE_ENV
  const db = process.env.NODE_ENV === 'test' ? 'tests' : 'users';

  const url = `mongodb://mongodb:27017/${db}`;
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

  database = mongoose.connection;
  database.once('open', async () => {
    console.debug('Connected to the database.');
  });
  database.once('error', () => {
    console.error('Error connecting to the database.');
    process.exit(1);
  });
};

const disconnect = () => {
  mongoose.disconnect();
};

module.exports = {
  connect,
  disconnect,
};
