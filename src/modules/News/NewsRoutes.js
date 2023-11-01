const router = require("express").Router();
const { save, findByProject, update, remove, getAllNewsByEJ } = require("./NewsController");
const {
  existentUser,
  isMemberOnProject,
  haveRightsToTheNews,
} = require("@middlewares/auth");

router.post("/news/:projectId", isMemberOnProject, save);
router.get("/news/:projectId", existentUser, findByProject);
router.patch("/news", haveRightsToTheNews, update);
router.delete("/news/:projectId", haveRightsToTheNews, remove);

router.get("/news", existentUser, getAllNewsByEJ);

module.exports = router;