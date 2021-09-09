const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
const { SECRET_KEY } = require('../../config');

const checkAuth = (context) => {
  const authHeaders = context.req.headers.authorization;
  if (authHeaders) {
    const token = authHeaders.split('Bearer ')[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/expired token');
      }
    }
    throw new Error('Authentication token must be \'Bearer [token]\'');
  }
  throw new Error('Authorization token must be provided');
};
module.exports = checkAuth;