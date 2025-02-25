import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./db/plantas.db');

export class PlantaModel {
  static criarPlanta({ tipo, nome, altura }: any) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO plantas (tipo, nome, altura) VALUES (?, ?, ?)',
        [tipo, nome, altura],
        function (err) {
          if (err) reject(err);
          resolve({ id: this.lastID, tipo, nome, altura });
        }
      );
    });
  }

  static buscarTiposPlantas() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tipos_plantas', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }
}
