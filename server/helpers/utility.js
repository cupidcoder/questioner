// Miscellaneous helper functions
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const { JWT_SECRET } = process.env;

const Utility = {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} hashed password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  },
  /**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} True or False
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  /**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  /**
   * Gnerate Token
   * @param {int} userId
   * @param {boolean} isAdmin
   * @returns {string} token
   */
  generateToken(userId, isAdmin) {
    const token = jwt.sign({
      userId,
      isAdmin,
    },
    JWT_SECRET, { expiresIn: '7d' });
    return token;
  },
};

export default Utility;
