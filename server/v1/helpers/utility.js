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
  async hashPassword(password) {
    const hashedPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    return hashedPassword;
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
    JWT_SECRET, { expiresIn: '30d' });
    return token;
  },
  /**
   * Trim values of an object
   * @param {object} obj
   * @returns {object} trimmedObject
   */
  objectTrim(obj) {
    const objectCopy = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        objectCopy[key] = obj[key].toString().trim();
      }
    }
    return objectCopy;
  },
};

export default Utility;
