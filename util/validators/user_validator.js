const validator = require('validator');
module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (!username.trim()) {
    errors.username = "Username must not be empty";
  }
  if (!email.trim()) {
    errors.email = "Email must not be empty";
  } else {
    if (!validator.isEmail(email)) {
      errors.email = `Email must be a valid email address, ${email}`;
    }
  }
  if (!password) {
    errors.password = "Password must not be empty";
  } else if (password === confirmPassword) {
    errors.confirmPassword = "Password must match";
  }
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (!username.trim()) {
    errors.username = "Username must not be empty";
  }
  if (!password) {
    errors.password = "Password must not be empty";
  }
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};