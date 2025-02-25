// Controlador para operações com plantas
import { Request, Response } from 'express';
import { PlantaModel } from '../models/plantaModel';
import { validationMiddleware } from '../middlewares/validationMiddleware';

/**
 * Busca todas as plantas
 */
export const getPlantas = async (req: Request, res: Response) => {
    try {
        const plantas = await PlantaModel.buscarTodasPlantas();
        res.status(200).json(plantas);
    } catch (err: any) {
        console.error('Erro ao buscar plantas:', err);
        res.status(500).json({ message: 'Erro ao buscar plantas', error: err.message });
    }
};

/**
 * Busca uma planta específica pelo ID
 */
export const getPlantaById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const planta = await PlantaModel.buscarPlantaPorId(id);
        if (!planta) {
            return res.status(404).json({ message: 'Planta não encontrada' });
        }

        res.status(200).json(planta);
    } catch (err: any) {
        console.error('Erro ao buscar planta:', err);
        res.status(500).json({ message: 'Erro ao buscar planta', error: err.message });
    }
};

/**
 * Busca todos os tipos de plantas
 */
export const getTiposPlanta = async (req: Request, res: Response) => {
    try {
        const tipos = await PlantaModel.buscarTiposPlantas();
        res.status(200).json(tipos);
    } catch (err: any) {
        console.error('Erro ao buscar tipos de plantas:', err);
        res.status(500).json({ message: 'Erro ao buscar tipos de plantas', error: err.message });
    }
};

/**
 * Adiciona uma nova planta
 */
export const addPlanta = async (req: Request, res: Response) => {
    try {
        // Validação dos dados de entrada
        const validationResult = await validationMiddleware(req.body);

        if (validationResult.error) {
            return res.status(400).json({
                message: 'Dados inválidos',
                errors: validationResult.error
            });
        }

        const plantaData = req.body;
        const planta = await PlantaModel.criarPlanta(plantaData);

        res.status(201).json({
            message: 'Planta adicionada com sucesso!',
            planta
        });
    } catch (err: any) {
        console.error('Erro ao adicionar planta:', err);
        res.status(500).json({ message: 'Erro ao adicionar planta', error: err.message });
    }
};