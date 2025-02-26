// src/routes/route.ts
import express from 'express';
import {
    getPlantas,
    getPlantaById,
    getTiposPlanta,
    addPlanta
} from '../controllers/plantaController';

// Create a router instance
const router = express.Router();

// Define routes
router.get('/plantas', getPlantas);
router.get('/plantas/:id', getPlantaById);
router.get('/tipos-planta', getTiposPlanta);
router.post('/plantas', addPlanta);

// Export the router as default
export default router;