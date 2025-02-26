// src/database/database.ts
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// Ativar modo verbose para ter mais logs do SQLite
sqlite3.verbose();

// Garante que o diretório do banco de dados existe
const dbDir = path.resolve(__dirname, '../../db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.resolve(dbDir, 'plantas.db');

// Cria a conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados', err);
    } else {
        console.log('Conexão com o banco de dados bem-sucedida!');
    }
});

/**
 * Inicializa o esquema do banco de dados
 * Cria tabelas, índices, views e triggers se não existirem
 */
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
  `;

    db.exec(sql, (err) => {
        if (err) {
            console.error('Erro ao inicializar o banco de dados:', err.message);
        } else {
            console.log('Banco de dados inicializado com sucesso.');
            // Após inicializar o banco, vamos popular com dados iniciais
            seedTiposPlanta();
        }
    });
};

/**
 * Popula o banco com tipos de plantas iniciais caso esteja vazio
 */
const seedTiposPlanta = () => {
    // Verifica se já existem tipos de plantas
    db.get('SELECT COUNT(*) as count FROM tipos_planta', [], (err, row: any) => {
        if (err) {
            console.error('Erro ao verificar tipos de plantas:', err);
            return;
        }

        // Se não houver tipos de plantas, adiciona alguns
        if (row.count === 0) {
            const tiposPlantas = [
                { nome: 'Plantas de Interior' },
                { nome: 'Plantas de Exterior' },
                { nome: 'Suculentas' },
                { nome: 'Cactos' },
                { nome: 'Árvores Frutíferas' },
                { nome: 'Flores' },
                { nome: 'Ervas Aromáticas' }
            ];

            // Prepara a statement para inserção
            const stmt = db.prepare('INSERT INTO tipos_planta (nome) VALUES (?)');

            // Insere cada tipo de planta
            tiposPlantas.forEach(tipo => {
                stmt.run([tipo.nome], (err) => {
                    if (err) {
                        console.error(`Erro ao inserir tipo de planta ${tipo.nome}:`, err);
                    } else {
                        console.log(`Tipo de planta "${tipo.nome}" inserido com sucesso.`);
                    }
                });
            });

            // Finaliza a statement
            stmt.finalize();
            console.log('Tipos de plantas iniciais foram adicionados.');
        } else {
            console.log('Banco de dados já possui tipos de plantas.');
        }
    });
};

// Inicializa o banco de dados assim que o módulo for importado
initDB();

export default db;