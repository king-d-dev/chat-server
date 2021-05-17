import { Socket } from 'socket.io';

// Adapt Soc
export const adaptMiddleware = (middleware: Function) => (
  socket: Socket,
  next: Function
) => middleware(socket.request, {}, next);
