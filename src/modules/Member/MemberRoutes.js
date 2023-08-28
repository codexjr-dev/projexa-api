const router = require("express").Router();
const { save, findByEj, update, remove } = require("./MemberController");
const {
  validatedUser,
  authorizedUser,
  authorizedLeadership,
} = require("@middlewares/auth");

router.post("/member", authorizedLeadership, save);
router.get("/member", validatedUser, findByEj);
router.patch("/member/:id", authorizedUser, update);
router.delete("/member/:id", authorizedLeadership, remove);

module.exports = router;
