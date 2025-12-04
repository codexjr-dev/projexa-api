import express from "express";
import {
    save,
    findByOrganization,
    remove,
    update
} from "./user.controller";
import { authorize, Existent, Leadership, Restricted } from "../../middlewares/auth";
const router = express.Router();

router.post("/user", authorize(Leadership), save);
router.get("/user", authorize(Existent), findByOrganization);
router.patch("/user/:id", authorize(Restricted), update);
router.delete("/user/:id", authorize(Leadership), remove);

export default router;
