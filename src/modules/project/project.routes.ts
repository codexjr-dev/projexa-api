import express from "express";
import {
    authorize,
    Existent,
    Leadership
} from "../../middlewares/auth";
import {
    save,
    findByOrganization,
    findById,
    update,
    remove
} from "./project.controller";
const router = express.Router();

router.post("/project", authorize(Leadership), save);
router.get("/project", authorize(Existent), findByOrganization);
router.get("/project/:id", authorize(Existent), findById);
router.patch("/project/:id", authorize(Leadership), update);
router.delete("/project/:id", authorize(Leadership), remove);

export default router;
