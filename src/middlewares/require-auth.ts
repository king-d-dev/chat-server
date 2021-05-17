import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

export const requireAuth = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-7jgg0hkp.us.auth0.com/.well-known/jwks.json',
  }),
  audience: 'http://opus-chat.com/api',
  issuer: 'https://dev-7jgg0hkp.us.auth0.com/',
  algorithms: ['RS256'],
});
