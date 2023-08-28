const router = require("express").Router();
const { save, findByEj, update, remove } = require("./LinkController");
const {
  validatedUser,
  authorizedUser,
  authorizedLeadership,
} = require("@middlewares/auth");

router.post("/link", authorizedLeadership, save);
router.get("/link", validatedUser, findByEj);
router.patch("/link/:id", authorizedUser, update);
router.delete("/link/:id", authorizedLeadership, remove);

module.exports = router;
