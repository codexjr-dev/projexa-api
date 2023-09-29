const router = require("express").Router();
const { save, findByEj, update, remove } = require("./MemberController");
const {
  existentUser,
  authorizedUser,
  isLeadership,
} = require("@middlewares/auth");

router.post("/member", isLeadership, save);
router.get("/member", existentUser, findByEj);
router.patch("/member/:id", authorizedUser, update);
router.delete("/member/:id", isLeadership, remove);

module.exports = router;
