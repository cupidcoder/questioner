import bcrypt from 'bcrypt';
import UserModel from '../models/User';
import APIResponse from '../helpers/Response';
import StatusCodes from '../helpers/status';
import Utility from '../helpers/utility';
import db from '../../db/index';
/**
 * User controller performs endpoint actions for the User
 */

const User = {
  /**
   * Sign up a user
   * @param {object} req
   * @param {object} res
   * @returns {object} userObject
   */
  async signup(req, res) {
    const response = new APIResponse();
    const userObj = req.body;
    const registeredOn = new Date().toLocaleString();
    bcrypt.hash(userObj.password, 8, async (err, hash) => {
      const valuesToInsert = [
        userObj.firstname, userObj.lastname, userObj.email, hash, registeredOn,
      ];
      try {
        const { rows } = await db.query(UserModel.insertUserQuery, valuesToInsert);
        const user = rows[0];
        const token = Utility.generateToken(user.id, user.is_admin);
        const newUserObj = {
          token,
          user,
        };
        response.setSuccess(StatusCodes.created, newUserObj);
        return response.send(res);
      } catch (error) {
        response.setFailure(StatusCodes.unavailable, 'Unable to proceed with your request. Please try again');
        return response.send(res);
      }
    });
  },

  /**
   * User Login method
   * @param {object} res
   * @param {object} req
   * @param {object} userObject
   */
  async login(req, res) {
    const response = new APIResponse();
    const loginInput = req.body;
    try {
      const { rows } = await db.query(UserModel.checkEmailQuery, [loginInput.email]);
      const user = rows[0];
      if (!user) {
        response.setFailure(StatusCodes.forbidden, 'Incorrect email/password');
        return response.send(res);
      }
      // check for password here
      if (!Utility.comparePassword(user.password, loginInput.password)) {
        response.setFailure(StatusCodes.forbidden, 'Incorrect email/password');
        return response.send(res);
      }
      // User has been authenticated
      const token = Utility.generateToken(user.id, user.is_admin);
      const loggedInUser = {
        token,
        user,
      };
      response.setSuccess(StatusCodes.success, loggedInUser);
      return response.send(res);
    } catch (error) {
      response.setFailure(StatusCodes.unavailable, 'Unable to proceed with your request. Please try again');
      return response.send(res);
    }
  },
};

export default User;
