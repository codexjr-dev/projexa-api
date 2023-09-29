const router = require("express").Router();
const { save, findByEj, update, remove } = require("./LinkController");
const {
  existentUser,
  authorizedUser,
  isLeadership,
} = require("@middlewares/auth");

router.post("/link", isLeadership, save);
router.get("/link", existentUser, findByEj);
router.patch("/link/:id", authorizedUser, update);
router.delete("/link/:id", isLeadership, remove);

module.exports = router;
