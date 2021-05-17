export interface Auth0User {
  email: string;
}

export enum SocketEvent {
  USERS = 'users',
  USER_CONNECTED = 'user connected',
  USER_DISCONNECTED = 'user disconnected',
  MESSAGE = 'message',
  MESSAGES = 'messages',
}
