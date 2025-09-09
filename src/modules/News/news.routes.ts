import express from "express";
import {
    existentUser,
    haveRightsToTheNews,
    isMemberOnProject
} from "../../middlewares/auth";
import {
    findByProject,
    getAllNewsByOrg,
    remove,
    save,
    update
} from "./news.controller";
const router = express.Router();

router.get("/news", existentUser, getAllNewsByOrg);
router.get("/news/:projectId", existentUser, findByProject);
router.post("/news/:projectId", isMemberOnProject, save);
router.patch("/news", haveRightsToTheNews, update);
router.delete("/news/:projectId", haveRightsToTheNews, remove);

export default router;
