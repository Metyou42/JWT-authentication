const Apierror = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
  try {
    const authorizationHeared = req.headers.authorization;
    if (!authorizationHeared) return next(Apierror.Unauthorizederror());

    const accessToken = authorizationHeared.split(' ')[1];
    if (!accessToken) return next(Apierror.Unauthorizederror());

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) return next(Apierror.Unauthorizederror());

    req.user = userData;
    next();
  } catch (e) {
    next(Apierror.Unauthorizederror());
  }
};
