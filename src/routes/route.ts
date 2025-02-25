import express from 'express';
import { getPlantas, addPlanta } from '../controller/plantaController';


const router = express.Router();

router.get('/plantas', getPlantas);
router.post('/adicionarPlantas', addPlanta);

export default router;
