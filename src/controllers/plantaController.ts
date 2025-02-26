// src/controllers/plantaController.ts
import { Request, Response, NextFunction } from 'express';
import { PlantaModel } from '../models/plantaModel';

/**
 * Get all plants
 */
export const getPlantas = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const plantas = await PlantaModel.buscarTodasPlantas();
        res.json(plantas);
    } catch (error) {
        next(error);
    }
};

/**
 * Get plant by ID
 */
export const getPlantaById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const planta = await PlantaModel.buscarPlantaPorId(id);
        if (!planta) {
            res.status(404).json({ error: 'Planta not found' });
            return;
        }
        res.json(planta);
    } catch (error) {
        next(error);
    }
};

/**
 * Add a new plant
 */
export const addPlanta = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const plantaData = req.body;
        const newPlanta = await PlantaModel.criarPlanta(plantaData);
        res.status(201).json(newPlanta);
    } catch (error) {
        next(error);
    }
};

/**
 * Get all plant types
 */
export const getTiposPlanta = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const tiposPlanta = await PlantaModel.buscarTiposPlantas();
        res.json(tiposPlanta);
    } catch (error) {
        next(error);
    }
};