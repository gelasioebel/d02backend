// Arquivo de definição de rotas
import express from 'express';
import { getPlantas, getPlantaById, addPlanta, getTiposPlanta } from '../controllers/plantaController';

const router = express.Router();

// Rotas para plantas
router.get('/plantas', getPlantas);
router.get('/plantas/:id', getPlantaById);
router.post('/plantas', addPlanta);

// Rotas para tipos de plantas
router.get('/tipos-planta', getTiposPlanta);

export default router;