// GLOBAL MIDDLEWARE
const User = require("../users/users-model");

// GLOBAL CONSOLE LOGGER => RETURNS DATE,TIME, REQUEST INFO
function logger(req, res, next) {
  const timestamp = new Date().toLocaleString();
  const method = req.method;
  const url = req.originalUrl;
  console.log(`[${timestamp}] ${method} to ${url}`);
  next();
}

// VALIDATE USER ID => /API/USERS/:ID
async function validateUserId(req, res, next) {
  try {
    const user = await User.getById(req.params.id);
    // CONDITIONAL LOGIC => IF NO USER
    if (!user) {
      next({ status: 404, message: "user not found" });
      // IF USER => ATTACH TO REQ.BODY AND CONTINUE DOWN
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error occured finding user",
    });
  }
}

// VALIDATE USER => /API/USERS
function validateUser(req, res, next) {
  const { name } = req.body;
  if (!name || !name.trim()) {
    res.status(400).json({
      success: false,
      message: "missing required name field",
    });
  } else {
    req.name = name.trim();
    next();
  }
}

// VALIDATE POSTS => /API/USERS/ID/POSTS
function validatePost(req, res, next) {
  const { text } = req.body;
  if (!text || !text.trim()) {
    res.status(400).json({
      success: false,
      message: "missing required text field",
    });
  } else {
    req.text = text.trim();
    next();
  }
}

// DO NOT FORGET TO EXPORT THESE FUNCTIONS TO OTHER MODULES
module.exports = {
  logger,
  validateUser,
  validateUserId,
  validatePost,
};
