const bcrypt = require('bcrypt');
const uuid = require('uuid');
const User = require('../models/user-model');
const sendEmailService = require('./sendEmail-service');
const TokeService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const tokenService = require('./token-service');

class UserService {
  async registration(email, password) {
    const candidate = await User.findOne({ email });
    if (candidate) throw ApiError.BadRequest(`User with email ${email} already existed`);

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const user = await User.create({ email, password: hashPassword, activationLink });
    await sendEmailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    const userDto = new UserDto(user);
    const token = TokeService.generateTokens({ ...userDto });
    await TokeService.saveToken(userDto.id, token.refreshToken);

    return { ...token, user: userDto };
  }

  async activate(activationLink) {
    const user = await User.findOne({ activationLink });
    if (!user) throw ApiError.BadRequest('Invalid activation link');
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const candidate = await User.findOne({ email });
    if (!candidate) throw ApiError.BadRequest('User does not exited');
    const isUser = await bcrypt.compare(password, candidate.password);
    if (!isUser) throw ApiError.BadRequest('Invalid password or email');
    const userDto = new UserDto(candidate);

    const token = TokeService.generateTokens({ ...userDto });
    await TokeService.saveToken(userDto.id, token.refreshToken);

    return { ...token, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw ApiError.Unauthorizederror();

    const userData = TokeService.validateRefreshToken(refreshToken);
    const tokenFromBd = await TokeService.findToken(refreshToken);

    if (!userData || !tokenFromBd) throw ApiError.Unauthorizederror();

    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);
    const token = TokeService.generateTokens({ ...userDto });
    await TokeService.saveToken(userDto.id, token.refreshToken);

    return { ...token, user: userDto };
  }

  async getAllUsers() {
    const users = User.find();
    return users;
  }
}

module.exports = new UserService();
