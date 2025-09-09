import express from "express";
import {
    save,
    findAll,
    findById,
} from "./organization.controller";
const router = express.Router();

router.post("/organization", save);
router.get("/organization/:id", findById);
router.get("/organization", findAll);

export default router;
