const router = require("express").Router();
const { save, findByEj, remove, update } = require("./UserController");
const {
  existentUser,
  authorizedUser,
  isLeadership
} = require("@middlewares/auth");

router.post("/user", isLeadership, save);
router.get("/user", existentUser, findByEj);
router.patch("/user/:id", authorizedUser, update);
router.delete("/user/:id", isLeadership, remove);

module.exports = router;
