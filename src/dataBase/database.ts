import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure the db directory exists
const dbDir = path.resolve(__dirname, '../../db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.resolve(dbDir, 'plantas.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados', err);
  } else {
    console.log('Conexão com o banco de dados bem-sucedida!');
  }
});

export const initDB = () => {
  const sql = `
    -- Criação da tabela de tipos de planta
    CREATE TABLE IF NOT EXISTS tipos_planta (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Criação da tabela de plantas
    CREATE TABLE IF NOT EXISTS plantas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(100) NOT NULL,
      subtitulo VARCHAR(200) NOT NULL,
      etiquetas TEXT NOT NULL,
      preco DECIMAL(10,2) NOT NULL,
      esta_em_promocao BOOLEAN DEFAULT FALSE,
      porcentagem_desconto DECIMAL(5,2),
      caracteristicas TEXT NOT NULL,
      descricao TEXT NOT NULL,
      url_imagem VARCHAR(255) NOT NULL,
      tipo_planta_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tipo_planta_id) REFERENCES tipos_planta(id) ON DELETE CASCADE
    );

    -- Trigger para atualizar updated_at em tipos_planta
    CREATE TRIGGER IF NOT EXISTS tipos_planta_updated_at
    AFTER UPDATE ON tipos_planta
    FOR EACH ROW
    BEGIN
      UPDATE tipos_planta 
      SET updated_at = CURRENT_TIMESTAMP 
      WHERE id = old.id;
    END;

    -- Trigger para atualizar updated_at em plantas
    CREATE TRIGGER IF NOT EXISTS plantas_updated_at
    AFTER UPDATE ON plantas
    FOR EACH ROW
    BEGIN
      UPDATE plantas 
      SET updated_at = CURRENT_TIMESTAMP 
      WHERE id = old.id;
    END;

    -- Criação de índices para melhor performance
    CREATE INDEX IF NOT EXISTS idx_plantas_tipo_planta_id ON plantas(tipo_planta_id);
    CREATE INDEX IF NOT EXISTS idx_plantas_esta_em_promocao ON plantas(esta_em_promocao);
    CREATE INDEX IF NOT EXISTS idx_plantas_preco ON plantas(preco);

    -- View para plantas em promoção
    CREATE VIEW IF NOT EXISTS view_plantas_promocao AS
    SELECT 
      p.*,
      tp.nome as tipo_planta_nome,
      ROUND(p.preco * (1 - p.porcentagem_desconto/100), 2) as preco_promocional
    FROM plantas p
    JOIN tipos_planta tp ON p.tipo_planta_id = tp.id
    WHERE p.esta_em_promocao = true;

    -- View para relatório de plantas por tipo
    CREATE VIEW IF NOT EXISTS view_relatorio_plantas_por_tipo AS
    SELECT 
      tp.nome as tipo_planta,
      COUNT(*) as quantidade_plantas,
      ROUND(AVG(p.preco), 2) as preco_medio,
      COUNT(CASE WHEN p.esta_em_promocao THEN 1 END) as quantidade_em_promocao
    FROM tipos_planta tp
    LEFT JOIN plantas p ON tp.id = p.tipo_planta_id
    GROUP BY tp.id, tp.nome;
  `;

  db.exec(sql, (err) => {
    if (err) {
      console.error('Erro ao inicializar o banco de dados:', err.message);
    } else {
      console.log('Banco de dados inicializado com sucesso.');
    }
  });
};

// Initialize the database on module load
initDB();

export default db;