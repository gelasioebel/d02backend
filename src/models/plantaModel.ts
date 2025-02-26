// src/models/plantaModel.ts
import db from '../database/database';

// Interfaces para os tipos de dados
export interface Planta {
  id: number;
  nome: string;
  subtitulo: string;
  etiquetas: string;
  preco: number;
  esta_em_promocao: boolean;
  porcentagem_desconto?: number;
  caracteristicas: string;
  descricao: string;
  url_imagem: string;
  tipo_planta_id: number;
  created_at: string;
  updated_at: string;
}

export interface PlantaInput {
  nome: string;
  subtitulo: string;
  etiquetas: string;
  preco: number;
  esta_em_promocao?: boolean;
  porcentagem_desconto?: number;
  caracteristicas: string;
  descricao: string;
  url_imagem: string;
  tipo_planta_id: number;
}

export interface TipoPlanta {
  id: number;
  nome: string;
  created_at: string;
  updated_at: string;
}

interface DbError extends Error {
  code?: string;
  errno?: number;
  message: string;
}

export class PlantaModel {
  /**
   * Busca uma planta pelo ID
   * @param id ID da planta a ser buscada
   * @returns Promise com a planta encontrada ou undefined se não encontrada
   */
  static buscarPlantaPorId(id: string): Promise<Planta | undefined> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM plantas WHERE id = ?', [id], (err: DbError | null, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row as Planta | undefined);
      });
    });
  }

  /**
   * Busca todas as plantas
   * @returns Promise com array de plantas
   */
  static buscarTodasPlantas(): Promise<Planta[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM plantas', (err: DbError | null, rows: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows as Planta[]);
      });
    });
  }

  /**
   * Adiciona uma nova planta ao banco de dados
   * @param planta Dados da planta a ser adicionada
   * @returns Promise com a planta adicionada incluindo seu ID
   */
  static criarPlanta(planta: PlantaInput): Promise<Planta> {
    return new Promise((resolve, reject) => {
      const {
        nome,
        subtitulo,
        etiquetas,
        preco,
        esta_em_promocao,
        porcentagem_desconto,
        caracteristicas,
        descricao,
        url_imagem,
        tipo_planta_id
      } = planta;

      db.run(
          `INSERT INTO plantas (
          nome, subtitulo, etiquetas, preco,
          esta_em_promocao, porcentagem_desconto,
          caracteristicas, descricao, url_imagem, tipo_planta_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            nome,
            subtitulo,
            etiquetas,
            preco,
            esta_em_promocao || false,
            porcentagem_desconto || null,
            caracteristicas,
            descricao,
            url_imagem,
            tipo_planta_id
          ],
          function(this: { lastID: number }, err: DbError | null) {
            if (err) {
              reject(err);
              return;
            }

            // Get the inserted plant to return
            db.get('SELECT * FROM plantas WHERE id = ?', [this.lastID], (err: DbError | null, row: any) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(row as Planta);
            });
          }
      );
    });
  }

  /**
   * Busca todos os tipos de plantas
   * @returns Promise com array de tipos de plantas
   */
  static buscarTiposPlantas(): Promise<TipoPlanta[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tipos_planta', (err: DbError | null, rows: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows as TipoPlanta[]);
      });
    });
  }
}

// For backward compatibility with previous code
export const getPlantaByIdFromDB = PlantaModel.buscarPlantaPorId;
export const getAllPlantasFromDB = PlantaModel.buscarTodasPlantas;
export const addPlantaToDB = PlantaModel.criarPlanta;
export const getTiposPlantaFromDB = PlantaModel.buscarTiposPlantas;