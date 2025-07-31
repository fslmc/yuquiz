import bcrypt from 'bcrypt';

// Validate password strength
export const validatePassword = (password) => {
  const minLength = 8;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  
  if (password.length < minLength) {
    return 'Password must be at least 8 characters';
  }
  
  if (!hasNumber.test(password)) {
    return 'Password must contain at least one number';
  }
  
  if (!hasSpecialChar.test(password)) {
    return 'Password must contain at least one special character';
  }
  
  return null;
};

// Hash password
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};