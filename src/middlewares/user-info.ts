import { RequestHandler } from 'express';
import axios from 'axios';
import { Auth0User } from '../types';

export const userInfo: RequestHandler = async (req, res, next) => {
  const response = await axios.get<Auth0User>(
    'https://dev-7jgg0hkp.us.auth0.com/userinfo',
    { headers: { Authorization: req.headers.authorization } }
  );

  req.user.email = response.data.email;

  next();
};
