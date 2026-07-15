require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: (process.env.CLIENT_URLS || '').split(','),
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      socket.emit('server:ready', { message: 'Socket signaling server connected.' });

      socket.on('disconnect', () => {
        // reserved for module 3
      });
    });

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
