const { StatusCodes } = require("http-status-codes");

const authorizeUser = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    return next();
  } else {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: "Unauthorized user" });
  }
};

module.exports = {
  AuthorizationMiddleware: authorizeUser,
};
