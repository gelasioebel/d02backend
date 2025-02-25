import db from '../database/database';

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

  static buscarTiposPlantas(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tipos_planta', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static buscarTodasPlantas(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM plantas', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static buscarPlantaPorId(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM plantas WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }
}