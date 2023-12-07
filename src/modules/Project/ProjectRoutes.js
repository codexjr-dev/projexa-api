const router = require("express").Router();
const { save, findByEj, findById, update, remove } = require("./ProjectController");
const {
  existentUser,
  isLeadership,
} = require("@middlewares/auth");

router.post("/project", isLeadership, save);
router.get("/project", existentUser, findByEj);
router.get("/project/:id", existentUser, findById);
router.patch("/project/:id", isLeadership, update);
router.delete("/project/:id", isLeadership, remove);

module.exports = router;
