const express = require("express");
// You will need `users-model.js` and `posts-model.js` both
const Users = require("../users/users-model");
const Posts = require("../posts/posts-model");
// The middleware functions also need to be required

const {
  valideUserId,
  validateUser,
  validePost,
} = require("../middleware/middleware");

const router = express.Router();

// METHOD(GET) => GET ALL USERS /API/USERS
router.get("/", (req, res) => {
  Users.get().then((users) => {
    res.status(200).json({
      success: true,
      data: users,
    });
  });

  // METHOD(GET) => GET USER BY ID /API/USERS/:ID
  router.get("/:id", (req, res) => {
    res.json(req.user);
  });

  // METHOD(POST) => CREATE A USER
  router.post("/", validateUser, (req, res, next) => {
    const userInfo = req.body;
    Users.insert(userInfo)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch(next);
  });

  // METHOD(PUT) => UPDATE USER
  router.put("/:id", (req, res) => {
    Users.update(req.params.id, req.body).then((user) => {
      res.status(200).json(user);
    });
  });

  // METHOD(DELETE) => DELETE USER
  router.delete("/:id", valideUserId, async (req, res, next) => {
    const currentUser = await Users.getById(req.params.id);
    try {
      await Users.remove(req.params.id);
      res.json(currentUser);
    } catch (error) {
      next(error);
    }
  });

  // METHOD(GET) => GET POST BY ID
  router.get("/:id/posts", valideUserId, async (req, res, next) => {
    const comments = await Users.getUserPosts(req.params.id);
    try {
      res.json(comments);
    } catch (error) {
      next(error);
    }
  });

  // METHOD(POST) => CREATE POST BY ID
  router.post(
    "/:id/posts",
    valideUserId,
    validePost,
    async (req, res, next) => {
      const postInfo = { user_id: req.params.id, text: req.body.text };
      Posts.insert(postInfo)
        .then(() => {
          res.status(201).json(postInfo);
        })
        .catch(next);
    }
  );
  // eslint-disable-next-line
  router.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
      customMessage: "Stuff in user router",
    });
  });
});
// do not forget to export the router
module.exports = router;
