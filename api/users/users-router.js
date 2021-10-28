const express = require("express");
// You will need `users-model.js` and `posts-model.js` both
const Users = require("../users/users-model");
// The middleware functions also need to be required

const router = express.Router();

router.get("/", (req, res) => {
  Users.get().then((users) => {
    res.status(200).json({
      success: true,
      data: users,
    });
  });
});

// do not forget to export the router
module.exports = router;
