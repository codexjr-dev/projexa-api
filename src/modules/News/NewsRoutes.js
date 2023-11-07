const router = require("express").Router();
const { getAllNewsByEJ, findByProject, save, update, remove } = require("./NewsController");
const {
  existentUser,
  isMemberOnProject,
  haveRightsToTheNews,
} = require("@middlewares/auth");

router.get("/news", existentUser, getAllNewsByEJ);
router.get("/news/:projectId", existentUser, findByProject);
router.post("/news/:projectId", isMemberOnProject, save);
router.patch("/news", haveRightsToTheNews, update);
router.delete("/news/:projectId", haveRightsToTheNews, remove);

module.exports = router;