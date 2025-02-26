// src/database/initDatabase.ts
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import db from './database';

console.log('=== Initializing Database with Schema and Default Data ===');

/**
 * Initializes the database schema by creating all necessary tables,
 * triggers, indices, and views if they don't already exist.
 */
export const initSchema = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        console.log('Creating database schema...');

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
                console.error('Error initializing database schema:', err.message);
                reject(err);
            } else {
                console.log('✓ Database schema created successfully');
                resolve();
            }
        });
    });
};

/**
 * Seeds the database with initial plant types if the table is empty.
 */
export const seedTiposPlanta = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        console.log('Checking if plant types need to be seeded...');

        // Check if plant types already exist
        db.get('SELECT COUNT(*) as count FROM tipos_planta', [], (err, row: any) => {
            if (err) {
                console.error('Error checking plant types:', err);
                reject(err);
                return;
            }

            // If no plant types exist, add the default ones
            if (row.count === 0) {
                console.log('Seeding initial plant types...');

                const tiposPlantas = [
                    { nome: 'Plantas de Interior' },
                    { nome: 'Plantas de Exterior' },
                    { nome: 'Suculentas' },
                    { nome: 'Cactos' },
                    { nome: 'Árvores Frutíferas' },
                    { nome: 'Flores' },
                    { nome: 'Ervas Aromáticas' }
                ];

                // Use a transaction for better performance and data integrity
                db.run('BEGIN TRANSACTION', (err) => {
                    if (err) {
                        console.error('Error starting transaction:', err);
                        reject(err);
                        return;
                    }

                    const stmt = db.prepare('INSERT INTO tipos_planta (nome) VALUES (?)');
                    let completed = 0;
                    let errors = 0;

                    tiposPlantas.forEach((tipo, index) => {
                        stmt.run([tipo.nome], (err) => {
                            if (err) {
                                console.error(`Error inserting plant type ${tipo.nome}:`, err);
                                errors++;
                            } else {
                                console.log(`✓ Plant type "${tipo.nome}" inserted successfully`);
                            }

                            completed++;

                            // If all inserts have been attempted
                            if (completed === tiposPlantas.length) {
                                stmt.finalize();

                                if (errors > 0) {
                                    db.run('ROLLBACK', () => {
                                        console.error(`Transaction rolled back due to ${errors} errors`);
                                        reject(new Error('Failed to seed plant types'));
                                    });
                                } else {
                                    db.run('COMMIT', (err) => {
                                        if (err) {
                                            console.error('Error committing transaction:', err);
                                            reject(err);
                                        } else {
                                            console.log('✓ All plant types seeded successfully');
                                            resolve();
                                        }
                                    });
                                }
                            }
                        });
                    });
                });
            } else {
                console.log('✓ Plant types already exist in the database');
                resolve();
            }
        });
    });
};

/**
 * Copies the default.png to the public/images directory if it doesn't exist
 * and creates the directory structure if needed.
 */
export const setupDefaultImage = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        console.log('Setting up default plant image...');

        // Create the public/images directory if it doesn't exist
        const publicDir = path.resolve(__dirname, '../../public');
        const imagesDir = path.resolve(publicDir, 'images');

        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }

        const defaultImageSource = path.resolve(__dirname, '../../assets/default.png');
        const defaultImageDest = path.resolve(imagesDir, 'default.png');

        // Check if default.png exists in assets
        if (!fs.existsSync(defaultImageSource)) {
            console.warn('Warning: default.png not found in assets directory');
            // Create a simple placeholder image if the source doesn't exist
            const relativePath = '/images/placeholder.png';
            console.log(`✓ Using placeholder image at ${relativePath}`);
            resolve(relativePath);
            return;
        }

        // Only copy if the destination doesn't exist
        if (!fs.existsSync(defaultImageDest)) {
            try {
                fs.copyFileSync(defaultImageSource, defaultImageDest);
                console.log('✓ Default image copied to public/images/default.png');
            } catch (err) {
                console.error('Error copying default image:', err);
                reject(err);
                return;
            }
        } else {
            console.log('✓ Default image already exists in public/images');
        }

        // Return the relative path that should be used in the database
        const relativePath = '/images/default.png';
        resolve(relativePath);
    });
};

/**
 * Seeds the database with sample plants if the table is empty,
 * using the default image for plant images.
 */
export const seedPlantas = (defaultImagePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        console.log('Checking if sample plants need to be seeded...');

        db.get('SELECT COUNT(*) as count FROM plantas', [], (err, row: any) => {
            if (err) {
                console.error('Error checking plants count:', err);
                reject(err);
                return;
            }

            if (row.count === 0) {
                console.log('Seeding sample plants...');

                // Get all plant types to reference them
                db.all('SELECT id, nome FROM tipos_planta', [], (err, tipos: any[]) => {
                    if (err) {
                        console.error('Error fetching plant types:', err);
                        reject(err);
                        return;
                    }

                    // Map tipo names to IDs for easier reference
                    const tipoMap: {[key: string]: number} = {};
                    tipos.forEach(tipo => {
                        tipoMap[tipo.nome] = tipo.id;
                    });

                    // Sample plants data
                    const plantas = [
                        {
                            nome: "Espada de São Jorge",
                            subtitulo: "Planta resistente e de baixa manutenção",
                            etiquetas: "interior,resistente,ar purificado",
                            preco: 45.90,
                            esta_em_promocao: false,
                            porcentagem_desconto: null,
                            caracteristicas: "Baixa manutenção; Tolera ambientes secos; Purifica o ar",
                            descricao: "A Espada de São Jorge é uma das plantas mais resistentes que existem. Ela suporta longos períodos sem água e pouca luz, sendo perfeita para iniciantes ou pessoas que viajam com frequência.",
                            url_imagem: defaultImagePath,
                            tipo_planta_id: tipoMap["Plantas de Interior"] || 1
                        },
                        {
                            nome: "Suculenta Echeveria",
                            subtitulo: "Suculenta com roseta em tons de azul e rosa",
                            etiquetas: "suculenta,baixa manutenção,decorativa",
                            preco: 18.90,
                            esta_em_promocao: true,
                            porcentagem_desconto: 10,
                            caracteristicas: "Roseta compacta; Cores variadas; Pouca água",
                            descricao: "A Echeveria é uma suculenta popular conhecida por suas rosetas compactas que podem apresentar tons de azul, rosa e verde. Perfeita para quem busca plantas fáceis de cuidar.",
                            url_imagem: defaultImagePath,
                            tipo_planta_id: tipoMap["Suculentas"] || 3
                        },
                        {
                            nome: "Lírio da Paz",
                            subtitulo: "Planta elegante com flores brancas",
                            etiquetas: "interior,flores,purificadora",
                            preco: 39.90,
                            esta_em_promocao: false,
                            porcentagem_desconto: null,
                            caracteristicas: "Flores brancas; Purifica o ar; Pouca luz",
                            descricao: "O Lírio da Paz é conhecido por suas flores brancas elegantes e capacidade de purificar o ar. É uma ótima opção para quem busca beleza e benefícios para a saúde.",
                            url_imagem: defaultImagePath,
                            tipo_planta_id: tipoMap["Plantas de Interior"] || 1
                        }
                    ];

                    // Begin transaction for inserting plants
                    db.run('BEGIN TRANSACTION', (err) => {
                        if (err) {
                            console.error('Error starting transaction:', err);
                            reject(err);
                            return;
                        }

                        const stmt = db.prepare(`
                            INSERT INTO plantas (
                                nome, subtitulo, etiquetas, preco,
                                esta_em_promocao, porcentagem_desconto,
                                caracteristicas, descricao, url_imagem, tipo_planta_id
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `);

                        let completed = 0;
                        let errors = 0;

                        plantas.forEach((planta, index) => {
                            stmt.run([
                                planta.nome,
                                planta.subtitulo,
                                planta.etiquetas,
                                planta.preco,
                                planta.esta_em_promocao ? 1 : 0,
                                planta.porcentagem_desconto,
                                planta.caracteristicas,
                                planta.descricao,
                                planta.url_imagem,
                                planta.tipo_planta_id
                            ], function(err) {
                                if (err) {
                                    console.error(`Error inserting plant ${planta.nome}:`, err);
                                    errors++;
                                } else {
                                    console.log(`✓ Plant "${planta.nome}" inserted with ID ${this.lastID}`);
                                }

                                completed++;

                                if (completed === plantas.length) {
                                    stmt.finalize();

                                    if (errors > 0) {
                                        db.run('ROLLBACK', () => {
                                            console.error(`Transaction rolled back due to ${errors} errors`);
                                            reject(new Error('Failed to seed plants'));
                                        });
                                    } else {
                                        db.run('COMMIT', (err) => {
                                            if (err) {
                                                console.error('Error committing transaction:', err);
                                                reject(err);
                                            } else {
                                                console.log('✓ All sample plants seeded successfully');
                                                resolve();
                                            }
                                        });
                                    }
                                }
                            });
                        });
                    });
                });
            } else {
                console.log('✓ Plants already exist in the database');
                resolve();
            }
        });
    });
};

/**
 * Main function to initialize the database
 */
export const initializeDatabase = async (): Promise<void> => {
    try {
        // Step 1: Create schema
        await initSchema();

        // Step 2: Seed plant types
        await seedTiposPlanta();

        // Step 3: Setup default image
        const defaultImagePath = await setupDefaultImage();

        // Step 4: Seed sample plants with default image
        await seedPlantas(defaultImagePath);

        console.log('=== Database initialization completed successfully ===');
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
};

// Initialize the database when this module is imported
initializeDatabase().catch(error => {
    console.error('Failed to initialize database:', error);
});

export default initializeDatabase;