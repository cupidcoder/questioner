import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../../db/index';
import APIResponse from '../helpers/Response';
import statusCodes from '../helpers/status';

dotenv.config();

const { JWT_SECRET } = process.env;

const Auth = {
  /**
   * Verify Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  /* eslint-disable  consistent-return */
  async verifyToken(req, res, next) {
    const response = new APIResponse();
    const token = req.headers['x-access-token'];
    if (!token) {
      response.setFailure(statusCodes.forbidden, 'Token is not provided');
      return response.send(res);
    }
    try {
      const decoded = await jwt.verify(token, JWT_SECRET);
      const text = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await db.query(text, [decoded.userId]);
      if (!rows[0]) {
        response.setFailure(statusCodes.badRequest, 'The token you provided is invalid');
        return response.send(res);
      }
      req.user = { id: decoded.userId, isAdmin: decoded.isAdmin };
      next();
    } catch (error) {
      response.setFailure(statusCodes.badRequest, error);
      return response.send(res);
    }
  },
};

export default Auth;
