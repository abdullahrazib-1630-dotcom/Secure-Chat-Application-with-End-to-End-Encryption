require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const app = require('./app');
const socketServer = require('./socket');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
      credentials: true,
    },
  });

  socketServer(io);

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Secure chat backend running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Server startup failed:', error.message);
  process.exit(1);
});
