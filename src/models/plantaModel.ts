// Modelo para operações no banco de dados relacionadas a plantas
import db from '../database/database';

// Interface que define os campos necessários para criar uma planta
interface PlantaInput {
  tipo_planta_id: number;
  nome: string;
  subtitulo: string;
  etiquetas: string;
  preco: number;
  esta_em_promocao?: boolean;
  porcentagem_desconto?: number;
  caracteristicas: string;
  descricao: string;
  url_imagem: string;
}

export class PlantaModel {
  /**
   * Cria uma nova planta no banco de dados
   * @param planta Dados da planta a ser criada
   * @returns Promise com a planta criada incluindo seu ID
   */
  static criarPlanta(planta: PlantaInput): Promise<PlantaInput & { id: number }> {
    return new Promise((resolve, reject) => {
      const {
        tipo_planta_id,
        nome,
        subtitulo,
        etiquetas,
        preco,
        esta_em_promocao,
        porcentagem_desconto,
        caracteristicas,
        descricao,
        url_imagem
      } = planta;

      db.run(
          `INSERT INTO plantas (
            tipo_planta_id, nome, subtitulo, etiquetas, preco,
            esta_em_promocao, porcentagem_desconto,
            caracteristicas, descricao, url_imagem
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            tipo_planta_id, nome, subtitulo, etiquetas, preco,
            esta_em_promocao || false, porcentagem_desconto || null,
            caracteristicas, descricao, url_imagem
          ],
          function (err) {
            if (err) reject(err);
            resolve({ ...planta, id: this.lastID });
          }
      );
    });
  }

  /**
   * Busca todos os tipos de plantas
   * @returns Promise com array de tipos de plantas
   */
  static buscarTiposPlantas(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tipos_planta', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  /**
   * Busca todas as plantas
   * @returns Promise com array de plantas
   */
  static buscarTodasPlantas(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM plantas', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  /**
   * Busca uma planta pelo ID
   * @param id ID da planta a ser buscada
   * @returns Promise com os dados da planta ou undefined se não encontrada
   */
  static buscarPlantaPorId(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM plantas WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }
}