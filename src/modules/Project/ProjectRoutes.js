const router = require("express").Router();
const { save, findByEj, update, remove } = require("./ProjectController");
const {
  validatedUser,
  authorizedUser,
  authorizedLeadership,
} = require("@middlewares/auth");

router.post("/project", authorizedLeadership, save);
router.get("/project", validatedUser, findByEj);
router.patch("/project/:id", authorizedUser, update);
router.delete("/project/:id", authorizedLeadership, remove);

module.exports = router;
