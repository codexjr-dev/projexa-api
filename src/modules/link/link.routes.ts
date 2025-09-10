import express from "express";
import {
    existentUser,
    isLeadership
} from "../../middlewares/auth";
import {
    save,
    findByOrganization,
    update,
    remove
} from "./link.controller";
const router = express.Router();

router.post("/link", isLeadership, save);
router.get("/link", existentUser, findByOrganization);
router.patch("/link/:id", isLeadership, update);
router.delete("/link/:id", isLeadership, remove);

export default router;
