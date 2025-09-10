import express from "express";
import {
    existentUser,
    isLeadership
} from "../../middlewares/auth";
import {
    save,
    findByOrganization,
    findById,
    update,
    remove
} from "./project.controller";
const router = express.Router();

router.post("/project", isLeadership, save);
router.get("/project", existentUser, findByOrganization);
router.get("/project/:id", existentUser, findById);
router.patch("/project/:id", isLeadership, update);
router.delete("/project/:id", isLeadership, remove);

export default router;
