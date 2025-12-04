import express from "express";
import {
    authorize,
    Existent,
    Leadership
} from "../../middlewares/auth";
import {
    save,
    findByOrganization,
    update,
    remove
} from "./link.controller";
const router = express.Router();

router.post("/link", authorize(Leadership), save);
router.get("/link", authorize(Existent), findByOrganization);
router.patch("/link/:id", authorize(Leadership), update);
router.delete("/link/:id", authorize(Leadership), remove);

export default router;
