const router = require("express").Router();
const { save, findByEj, remove, update } = require("./UserController");
const {
  validatedUser,
  authorizedUser,
  authorizedLeadership,
  authorizePresident,
} = require("@middlewares/auth");

router.post("/user", authorizedLeadership, save);
router.get("/user", validatedUser, findByEj);
router.patch("/user/:id", authorizedUser, update);
router.delete("/user/:id", authorizedLeadership, remove);

module.exports = router;
