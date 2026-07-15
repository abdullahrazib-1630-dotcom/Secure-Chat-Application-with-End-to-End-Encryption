require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const Chat = require('../src/models/Chat');
const Message = require('../src/models/Message');

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany({}), Chat.deleteMany({}), Message.deleteMany({})]);

  const [alice, bob] = await User.create([
    {
      name: 'Alice Secure',
      email: 'alice@example.com',
      password: 'Alice@1234',
      status: 'online',
    },
    {
      name: 'Bob Crypto',
      email: 'bob@example.com',
      password: 'Bob@1234',
      status: 'offline',
    },
  ]);

  const chat = await Chat.create({ participants: [alice._id, bob._id] });

  await Message.create([
    {
      chat: chat._id,
      sender: alice._id,
      receiver: bob._id,
      encryptedMessage: 'U2FsdGVkX1+dummycipher1=',
      readStatus: false,
    },
    {
      chat: chat._id,
      sender: bob._id,
      receiver: alice._id,
      encryptedMessage: 'U2FsdGVkX1+dummycipher2=',
      readStatus: true,
    },
  ]);

  // eslint-disable-next-line no-console
  console.log('Dummy users and messages seeded successfully.');
  await mongoose.connection.close();
};

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
