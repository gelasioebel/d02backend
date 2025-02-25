import express from 'express';
import { getPlantas, getPlantaById, addPlanta, getTiposPlanta } from '../controllers/plantaController';

const router = express.Router();

// Plantas routes
router.get('/plantas', getPlantas);
router.get('/plantas/:id', getPlantaById);
router.post('/plantas', addPlanta);

// Tipos de plantas routes
router.get('/tipos-planta', getTiposPlanta);

export default router;