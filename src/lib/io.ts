import http from 'http';
import { Server } from 'socket.io';
import { requireAuth } from '../middlewares/require-auth';
import { userInfo } from '../middlewares/user-info';
import { Message, MessageDoc } from '../models/message';
import { Auth0User, SocketEvent } from '../types';
import { adaptMiddleware } from '../util';

// Auguemt IncomingMessage Interface to include Auth0 user object
declare module 'http' {
  interface IncomingMessage {
    user: Auth0User;
  }
}

export default (server: http.Server) => {
  const io = new Server(server, { cors: { origin: 'http://localhost:3000' } });
  io.use(adaptMiddleware(requireAuth));
  io.use(adaptMiddleware(userInfo));

  // Log
  io.on('connection', (socket) => {
    console.log(`New connection from ${socket.request.user.email}`);
  });

  // Users list
  io.on('connection', (socket) => {
    socket.broadcast.emit(SocketEvent.USER_CONNECTED, socket.request.user);

    const users: { [key: string]: Auth0User } = {};
    for (let [id, _socket] of io.of('/').sockets) {
      const { email } = _socket.request.user;
      if (email === socket.request.user.email) continue;

      users[email] = { email };
    }

    socket.emit(SocketEvent.USERS, users);
  });

  // Fetch all messages for a user when socket connects/reconnects
  io.on('connection', async (socket) => {
    const { email } = socket.request.user;

    const messages = await Message.find({
      $or: [{ from: email }, { to: email }],
    });
    const perUser: { [key: string]: MessageDoc[] } = {};

    for (const message of messages as MessageDoc[]) {
      const key = message.from === email ? message.to : message.from;

      if (perUser[key]) {
        perUser[key].push(message);
      } else {
        perUser[key] = [message];
      }
    }

    socket.emit(SocketEvent.MESSAGES, perUser);
  });

  // Handle socket disconnection
  io.on('connection', async (socket) => {
    socket.join(socket.request.user.email);

    socket.on('disconnect', async () => {
      const { email } = socket.request.user;
      const matchingSockets = await io.in(email).allSockets();
      const isDisconnected = matchingSockets.size === 0;
      if (isDisconnected) {
        socket.broadcast.emit(SocketEvent.USER_DISCONNECTED, email);
      }
    });
  });

  // Send and receive messages
  io.on('connection', (socket) => {
    socket.on(SocketEvent.MESSAGE, async ({ text, to }) => {
      const from = socket.request.user.email;

      const message = await Message.build({ from, to, text }).save();
      socket.to(to).emit(SocketEvent.MESSAGE, message);
    });
  });
};
