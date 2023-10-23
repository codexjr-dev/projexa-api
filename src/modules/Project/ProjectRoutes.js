const router = require("express").Router();
const { save, findByEj, update, remove } = require("./ProjectController");
const {
  existentUser,
  isLeadership,
} = require("@middlewares/auth");

router.post("/project", isLeadership, save);
router.get("/project", existentUser, findByEj);
router.patch("/project/:id", isLeadership, update);
router.delete("/project/:id", isLeadership, remove);

module.exports = router;
