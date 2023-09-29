const router = require("express").Router();
const { save, findByEj, update, remove } = require("./ProjectController");
const {
  existentUser,
  authorizedUser,
  isLeadership,
} = require("@middlewares/auth");

router.post("/project", isLeadership, save);
router.get("/project", existentUser, findByEj);
router.patch("/project/:id", authorizedUser, update);
router.delete("/project/:id", isLeadership, remove);

module.exports = router;
