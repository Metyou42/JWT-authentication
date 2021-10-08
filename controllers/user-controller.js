const { validationResult } = require('express-validator');
const UserService = require('../service/user-service');
const ApiError = require('../exceptions/api-error');

class UserController {
  async getUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await UserService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const userData = await UserService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, { MaxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      console.log(errors.array());
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validations error', errors.array()));
      }
      const { email, password } = req.body;
      const userData = await UserService.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, { MaxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await UserService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, { MaxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
