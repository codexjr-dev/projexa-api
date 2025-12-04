import express from 'express';
import {
    findByProject,
    getAllNewsByOrg,
    remove,
    save,
    update
} from './news.controller';
import { authorize, Existent, Owner, Team } from '../../middlewares/auth';
const router = express.Router();

router.get('/news', authorize(Existent), getAllNewsByOrg);
router.get('/news/:projectId', authorize(Existent), findByProject);
router.post('/news/:projectId', authorize(Team), save);
router.patch('/news', authorize(Owner), update);
router.delete('/news/:projectId', authorize(Owner), remove);

export default router;
