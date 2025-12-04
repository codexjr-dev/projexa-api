import express from "express";
import {
    save,
    findByOrganization,
    remove,
    update,
    findByToken
} from "./user.controller";
import { authorize, Existent, Leadership, Restricted } from "../../middlewares/auth";
const router = express.Router();

router.post("/users", authorize(Leadership), save);
router.get("/users", authorize(Existent), findByOrganization);
router.get('/users/self', authorize(Existent), findByToken);
router.patch("/users/:id", authorize(Restricted), update);
router.delete("/users/:id", authorize(Leadership), remove);

export default router;
