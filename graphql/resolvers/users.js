const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { userValidator: { validateRegisterInput, validateLoginInput } } = require('../../util/validators');
const { User } = require('../../models');
const { SECRET_KEY } = require('../../config');

const generateToken = (user) => (
  jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username
  }, SECRET_KEY, { expiresIn: '1h' })
);

module.exports = {
  Mutation: {
    login: async (_, { username, password }) => {
      const { errors, isValid } = validateLoginInput(username, password);
      if (!isValid) {
        throw new UserInputError('Errors', { errors });
      }
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }
      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    register: async (_, { registerInput: { username, password, email, confirmPassword } }, context, info) => {
      //Todo validate user data
      const { errors, isValid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword);
      if (!isValid) {
        throw new UserInputError('Errors', { errors });
      }
      //Todo Make sure use doesn't already exist
      const user = await User.findOne({ email });
      if (user) {
        throw new UserInputError('Email is taken', {
          errors: {
            email: 'This email is taken'
          }
        });
      }
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });
      const res = await newUser.save();
      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
};