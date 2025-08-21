import express from "express";
import { save, findByEj, remove, update } from "./user.controller";
import {
    existentUser,
    authorizedUser,
    isLeadership,
} from "../../middlewares/auth";
const router = express.Router();

router.post("/user", isLeadership, save);
router.get("/user", existentUser, findByEj);
router.patch("/user/:id", authorizedUser, update);
router.delete("/user/:id", isLeadership, remove);

export default router;
