const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const {
  nodeEnv,
  mongoURI,
} = require('../config.js');

let isDBPrepared = false;

module.exports = {
  async connectDB() {
    if (nodeEnv === 'test') throw new Error('You cannot connect db on test mode');

    const conn = mongoose.connect(mongoURI, { useNewUrlParser: true });
    mongoose.connection.on('error', (err) => {
      throw new Error(`MongoDB connection error: ${err}`);
    });
    await conn;
  },
  async prepareDB() {
    if (nodeEnv !== 'test') throw new Error('You can drop db on test mode only');

    if (!isDBPrepared) {
      isDBPrepared = true;

      const mongod = new MongoMemoryServer();
      const conn = mongoose.connect(await mongod.getConnectionString(), {
        useNewUrlParser: true,
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
      });

      mongoose.connection.on('error', (err) => {
        throw new Error(`MongoDB connection error: ${err}`);
      });
      await conn;
    }
  },
  async deleteAllDataFromDB() {
    if (nodeEnv !== 'test') throw new Error('You can drop db on test mode only');

    await mongoose.connection.dropDatabase();
  },
};
