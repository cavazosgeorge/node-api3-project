const express = require("express");

const User = require("../users/users-model");
const Post = require("../posts/posts-model");

// The middleware functions also need to be required

const {
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");

const router = express.Router();

// METHOD(GET) => GET ALL USERS /API/USERS
router.get("/", (req, res, next) => {
  User.get()
    .then((users) => {
      res.json(users);
      console.log(users);
    })
    .catch(next);
});

// METHOD(GET) => GET USER BY ID /API/USERS/:ID
router.get("/:id", validateUserId, (req, res) => {
  res.json(req.user);
});

// METHOD(POST) => CREATE A USER
router.post("/", validateUser, (req, res, next) => {
  User.insert({ name: req.name })
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch(next);
});

// METHOD(PUT) => UPDATE USER
router.put("/:id", validateUserId, validateUser, (req, res, next) => {
  User.update(req.params.id, { name: req.name })
    .then(() => {
      return User.getById(req.params.id);
    })
    .then((user) => {
      res.json(user);
    })
    .catch(next);
});

// METHOD(DELETE) => DELETE USER
router.delete("/:id", validateUserId, async (req, res, next) => {
  try {
    await User.remove(req.params.id);
    res.json(req.user);
  } catch (err) {
    next(err);
  }
});

// METHOD(GET) => GET POST BY ID
router.get("/:id/posts", validateUserId, async (req, res, next) => {
  try {
    const result = await User.getUserPosts(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// METHOD(POST) => CREATE POST BY ID
router.post(
  "/:id/posts",
  validateUserId,
  validatePost,
  async (req, res, next) => {
    try {
      const result = await Post.insert({
        user_id: req.params.id,
        text: req.text,
      });
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
);

// EROR HANDLING MIDDLEWARE
// eslint-disable-next-line
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    customMessage: "Something tragic has happened inside the router",
    stack: err.stack,
  });
});

// do not forget to export the router
module.exports = router;
