import express from 'express';
import {
    save,
    findAll,
    findById,
    getBalance,
    addFinancialEvent,
    addRecurrentEvent
} from "./organization.controller";
const router = express.Router();

router.post('/organization', save);
router.get('/organization/:id', findById);
router.get('/organization', findAll);

router.get("/organization/:id/balance", getBalance);
router.post("/organization/:id/financial-event", addFinancialEvent);
router.post("/organization/:id/recurrent-event", addRecurrentEvent);

export default router;
