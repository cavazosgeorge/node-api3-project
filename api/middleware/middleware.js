const Users = require("../users/users-model");

function logger(req, res, next) {
  const time = new Date();
  console.log(`Request: ${req.method}, URL: ${req.url} at ${time}`);
  next();
}

function validateUserId(req, res, next) {
  const { id } = req.params;
  Users.getById(id)
    .then((possibleUser) => {
      if (possibleUser) {
        req.user = possibleUser;
        next();
      } else {
        next({
          success: false,
          message: "Not found",
          status: 404,
        });
      }
    })
    .catch(next);
}

function validateUser(req, res, next) {
  if (!req.body.name) {
    next({
      success: false,
      message: "Missing required name field",
      status: 400,
    });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body.text) {
    next({
      success: false,
      message: "Missing required text field",
      status: 400,
    });
  } else {
    next();
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};
