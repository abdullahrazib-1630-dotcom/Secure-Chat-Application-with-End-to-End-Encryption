const User = require('../models/User');

const onlineUsers = new Map();

const socketServer = (io) => {
  io.on('connection', (socket) => {
    socket.on('user-online', async ({ userId }) => {
      if (!userId) return;
      onlineUsers.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { status: 'online', lastSeen: new Date() });
      io.emit('presence-update', { userId, status: 'online' });
      io.emit('online-users', Array.from(onlineUsers.keys()));
    });

    socket.on('typing', ({ to, from, isTyping }) => {
      const targetSocket = onlineUsers.get(to);
      if (targetSocket) io.to(targetSocket).emit('typing', { from, isTyping });
    });

    socket.on('message-read', ({ to, messageId, readAt }) => {
      const targetSocket = onlineUsers.get(to);
      if (targetSocket) io.to(targetSocket).emit('message-read', { messageId, readAt });
    });

    socket.on('new-message', ({ to, payload }) => {
      const targetSocket = onlineUsers.get(to);
      if (targetSocket) io.to(targetSocket).emit('new-message', payload);
    });

    socket.on('webrtc-offer', ({ to, offer, from }) => {
      const targetSocket = onlineUsers.get(to);
      if (targetSocket) io.to(targetSocket).emit('webrtc-offer', { offer, from });
    });

    socket.on('webrtc-answer', ({ to, answer, from }) => {
      const targetSocket = onlineUsers.get(to);
      if (targetSocket) io.to(targetSocket).emit('webrtc-answer', { answer, from });
    });

    socket.on('webrtc-ice-candidate', ({ to, candidate, from }) => {
      const targetSocket = onlineUsers.get(to);
      if (targetSocket) io.to(targetSocket).emit('webrtc-ice-candidate', { candidate, from });
    });

    socket.on('disconnect', async () => {
      let disconnectedUserId = null;
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          onlineUsers.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        await User.findByIdAndUpdate(disconnectedUserId, { status: 'offline', lastSeen: new Date() });
        io.emit('presence-update', { userId: disconnectedUserId, status: 'offline' });
        io.emit('online-users', Array.from(onlineUsers.keys()));
      }
    });
  });
};

module.exports = socketServer;
