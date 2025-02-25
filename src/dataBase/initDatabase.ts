/**
 * Configuração Detalhada do Banco de Dados para API de Plantas
 *
 * Este script realiza três operações principais:
 * 1. Criar o banco de dados SQLite se não existir
 * 2. Criar as tabelas, índices, views e triggers necessários
 * 3. Adicionar tipos de plantas básicos se o banco estiver vazio
 *
 * Cada etapa é explicada em detalhes com logs extensos para acompanhamento.
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// Ativar modo verbose para ter mais logs do SQLite
sqlite3.verbose();

console.log('====================================================================');
console.log('INICIANDO CONFIGURAÇÃO DO BANCO DE DADOS DA API DE PLANTAS');
console.log('====================================================================');

// ==================== 1. CRIAR O BANCO DE DADOS SQLITE SE NÃO EXISTIR ====================

console.log('\n\n--- ETAPA 1: VERIFICAÇÃO E CRIAÇÃO DO BANCO DE DADOS ---\n');

// Primeiro, definimos o diretório onde o banco de dados será armazenado
const dbDir = path.resolve(__dirname, './db');
console.log(`Verificando existência do diretório: ${dbDir}`);

// Verificamos se o diretório existe
if (!fs.existsSync(dbDir)) {
    console.log(`Diretório não encontrado. Criando diretório: ${dbDir}`);

    try {
        // Criamos o diretório com a opção recursive para criar diretórios pai se necessário
        fs.mkdirSync(dbDir, { recursive: true });
        console.log(`✅ Diretório ${dbDir} criado com sucesso.`);
    } catch (err) {
        console.error(`❌ Erro ao criar diretório: ${err}`);
        process.exit(1); // Saímos do processo em caso de erro
    }
} else {
    console.log(`✅ Diretório ${dbDir} já existe.`);
}

// Agora, definimos o caminho completo para o arquivo do banco de dados
const dbPath = path.resolve(dbDir, 'plantas.db');
console.log(`Caminho do arquivo do banco de dados: ${dbPath}`);

// Verificamos se o arquivo do banco de dados já existe
if (fs.existsSync(dbPath)) {
    console.log(`O arquivo do banco de dados já existe em: ${dbPath}`);
    const stats = fs.statSync(dbPath);
    console.log(`Tamanho do arquivo: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`Última modificação: ${stats.mtime}`);
} else {
    console.log(`O arquivo do banco de dados não existe e será criado: ${dbPath}`);
}

// Criamos a conexão com o banco de dados
console.log('Estabelecendo conexão com o banco de dados SQLite...');
let db: sqlite3.Database;

try {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error(`❌ ERRO ao conectar com o banco de dados: ${err.message}`);
            process.exit(1);
        } else {
            console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
            console.log(`📝 SQLite versão: ${sqlite3.version}`);

            // Verificamos o modo de execução
            db.get("PRAGMA journal_mode;", (err, row) => {
                if (err) {
                    console.error(`❌ Erro ao verificar journal_mode: ${err.message}`);
                } else {
                    console.log(`SQLite journal_mode: ${row.journal_mode}`);
                }
            });

            // Agora que conectamos com sucesso, iniciamos a segunda etapa
            inicializarEsquemaBancoDados();
        }
    });
} catch (err) {
    console.error(`❌ Exceção ao criar conexão com o banco de dados: ${err}`);
    process.exit(1);
}

// ==================== 2. CRIAR TABELAS, ÍNDICES, VIEWS E TRIGGERS ====================

function inicializarEsquemaBancoDados() {
    console.log('\n\n--- ETAPA 2: CRIAÇÃO DE TABELAS, ÍNDICES, VIEWS E TRIGGERS ---\n');

    // Ativamos o modo de chave estrangeira para garantir integridade referencial
    db.run('PRAGMA foreign_keys = ON;', function(err) {
        if (err) {
            console.error(`❌ Erro ao ativar foreign_keys: ${err.message}`);
        } else {
            console.log('✅ Modo foreign_keys ativado com sucesso.');
        }
    });

    console.log('Criando tabelas se não existirem...');

    // Definimos as operações SQL como etapas separadas para facilitar o debug
    const steps = [
        // Etapa 1: Criar tabela tipos_planta
        {
            name: "Tabela tipos_planta",
            sql: `
        CREATE TABLE IF NOT EXISTS tipos_planta (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
        },

        // Etapa 2: Criar tabela plantas
        {
            name: "Tabela plantas",
            sql: `
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
      `
        },

        // Etapa 3: Criar trigger para tipos_planta
        {
            name: "Trigger para tipos_planta",
            sql: `
        CREATE TRIGGER IF NOT EXISTS tipos_planta_updated_at
        AFTER UPDATE ON tipos_planta
        FOR EACH ROW
        BEGIN
          UPDATE tipos_planta 
          SET updated_at = CURRENT_TIMESTAMP 
          WHERE id = old.id;
        END;
      `
        },

        // Etapa 4: Criar trigger para plantas
        {
            name: "Trigger para plantas",
            sql: `
        CREATE TRIGGER IF NOT EXISTS plantas_updated_at
        AFTER UPDATE ON plantas
        FOR EACH ROW
        BEGIN
          UPDATE plantas 
          SET updated_at = CURRENT_TIMESTAMP 
          WHERE id = old.id;
        END;
      `
        },

        // Etapa 5: Criar índices para melhor performance
        {
            name: "Índice para tipo_planta_id",
            sql: `CREATE INDEX IF NOT EXISTS idx_plantas_tipo_planta_id ON plantas(tipo_planta_id);`
        },
        {
            name: "Índice para esta_em_promocao",
            sql: `CREATE INDEX IF NOT EXISTS idx_plantas_esta_em_promocao ON plantas(esta_em_promocao);`
        },
        {
            name: "Índice para preco",
            sql: `CREATE INDEX IF NOT EXISTS idx_plantas_preco ON plantas(preco);`
        },

        // Etapa 6: Criar views
        {
            name: "View para plantas em promoção",
            sql: `
        CREATE VIEW IF NOT EXISTS view_plantas_promocao AS
        SELECT 
          p.*,
          tp.nome as tipo_planta_nome,
          ROUND(p.preco * (1 - p.porcentagem_desconto/100), 2) as preco_promocional
        FROM plantas p
        JOIN tipos_planta tp ON p.tipo_planta_id = tp.id
        WHERE p.esta_em_promocao = true;
      `
        },
        {
            name: "View para relatório de plantas por tipo",
            sql: `
        CREATE VIEW IF NOT EXISTS view_relatorio_plantas_por_tipo AS
        SELECT 
          tp.nome as tipo_planta,
          COUNT(*) as quantidade_plantas,
          ROUND(AVG(p.preco), 2) as preco_medio,
          COUNT(CASE WHEN p.esta_em_promocao THEN 1 END) as quantidade_em_promocao
        FROM tipos_planta tp
        LEFT JOIN plantas p ON tp.id = p.tipo_planta_id
        GROUP BY tp.id, tp.nome;
      `
        }
    ];

    // Função para executar as etapas sequencialmente
    function executarEtapas(index = 0) {
        if (index >= steps.length) {
            console.log('✅ Todas as estruturas do banco de dados foram criadas com sucesso!');

            // Após criar todas as estruturas, verificamos se elas existem
            verificarEstruturas(() => {
                // Depois de verificar, seguimos para a próxima etapa
                popularDadosIniciais();
            });
            return;
        }

        const step = steps[index];
        console.log(`Executando: ${step.name}...`);

        db.exec(step.sql, function(err) {
            if (err) {
                console.error(`❌ Erro ao criar ${step.name}: ${err.message}`);
            } else {
                console.log(`✅ ${step.name} criado/atualizado com sucesso.`);
            }

            // Executar a próxima etapa
            executarEtapas(index + 1);
        });
    }

    // Iniciar a execução das etapas
    executarEtapas();
}

// Função para verificar se as estruturas foram realmente criadas
function verificarEstruturas(callback: () => void) {
    console.log('\nVerificando estruturas criadas no banco de dados...');

    // Verificar tabelas
    db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';", (err, tables) => {
        if (err) {
            console.error(`❌ Erro ao verificar tabelas: ${err.message}`);
        } else {
            console.log('\nTabelas existentes:');
            tables.forEach(table => console.log(`- ${table.name}`));
        }

        // Verificar índices
        db.all("SELECT name FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%';", (err, indices) => {
            if (err) {
                console.error(`❌ Erro ao verificar índices: ${err.message}`);
            } else {
                console.log('\nÍndices existentes:');
                indices.forEach(index => console.log(`- ${index.name}`));
            }

            // Verificar views
            db.all("SELECT name FROM sqlite_master WHERE type='view';", (err, views) => {
                if (err) {
                    console.error(`❌ Erro ao verificar views: ${err.message}`);
                } else {
                    console.log('\nViews existentes:');
                    views.forEach(view => console.log(`- ${view.name}`));
                }

                // Verificar triggers
                db.all("SELECT name FROM sqlite_master WHERE type='trigger';", (err, triggers) => {
                    if (err) {
                        console.error(`❌ Erro ao verificar triggers: ${err.message}`);
                    } else {
                        console.log('\nTriggers existentes:');
                        triggers.forEach(trigger => console.log(`- ${trigger.name}`));
                    }

                    // Continuar para a próxima etapa
                    callback();
                });
            });
        });
    });
}

// ==================== 3. ADICIONAR TIPOS DE PLANTAS BÁSICOS SE O BANCO ESTIVER VAZIO ====================

function popularDadosIniciais() {
    console.log('\n\n--- ETAPA 3: POPULANDO DADOS INICIAIS ---\n');

    console.log('Verificando se a tabela tipos_planta está vazia...');

    // Verificamos se já existem tipos de plantas
    db.get('SELECT COUNT(*) as count FROM tipos_planta', [], (err, row: any) => {
        if (err) {
            console.error(`❌ Erro ao verificar contagem de tipos_planta: ${err.message}`);
            return;
        }

        console.log(`Número de tipos de plantas existentes: ${row.count}`);

        // Se não houver tipos de plantas, adicionamos os básicos
        if (row.count === 0) {
            console.log('🌱 Tabela tipos_planta está vazia. Adicionando tipos de plantas iniciais...');

            // Lista de tipos de plantas básicos para adicionar
            const tiposPlantas = [
                { nome: 'Plantas de Interior' },
                { nome: 'Plantas de Exterior' },
                { nome: 'Suculentas' },
                { nome: 'Cactos' },
                { nome: 'Árvores Frutíferas' },
                { nome: 'Flores' },
                { nome: 'Ervas Aromáticas' }
            ];

            console.log('Tipos de plantas a serem adicionados:');
            tiposPlantas.forEach((tipo, index) => {
                console.log(`${index + 1}. ${tipo.nome}`);
            });

            // Iniciamos uma transação para garantir que todas as inserções sejam concluídas juntas
            db.run('BEGIN TRANSACTION', function(err) {
                if (err) {
                    console.error(`❌ Erro ao iniciar transação: ${err.message}`);
                    return;
                }

                console.log('Transação iniciada. Inserindo tipos de plantas...');

                // Contadores para acompanhamento
                let inseridos = 0;
                let falhas = 0;

                // Preparamos a statement para inserção
                const stmt = db.prepare('INSERT INTO tipos_planta (nome) VALUES (?)');

                // Para cada tipo de planta...
                tiposPlantas.forEach((tipo, index) => {
                    // Inserimos no banco de dados
                    stmt.run([tipo.nome], function(err) {
                        if (err) {
                            console.error(`❌ Erro ao inserir tipo de planta "${tipo.nome}": ${err.message}`);
                            falhas++;
                        } else {
                            console.log(`✅ Tipo de planta "${tipo.nome}" inserido com ID: ${this.lastID}`);
                            inseridos++;
                        }

                        // Se esta foi a última inserção
                        if (index === tiposPlantas.length - 1) {
                            // Finalizamos a statement
                            stmt.finalize((err) => {
                                if (err) {
                                    console.error(`❌ Erro ao finalizar statement: ${err.message}`);
                                    db.run('ROLLBACK', () => {
                                        console.log('Rollback da transação realizado devido a erro.');
                                    });
                                    return;
                                }

                                // Commit da transação
                                db.run('COMMIT', function(err) {
                                    if (err) {
                                        console.error(`❌ Erro ao commitar transação: ${err.message}`);
                                        db.run('ROLLBACK', () => {
                                            console.log('Rollback da transação realizado devido a erro no commit.');
                                        });
                                        return;
                                    }

                                    console.log(`\n✅ Transação completada com sucesso!`);
                                    console.log(`📊 Estatísticas: ${inseridos} tipos de plantas inseridos, ${falhas} falhas.`);

                                    // Exibimos os tipos de plantas inseridos
                                    db.all('SELECT * FROM tipos_planta ORDER BY id', [], (err, rows) => {
                                        if (err) {
                                            console.error(`❌ Erro ao consultar tipos de plantas: ${err.message}`);
                                        } else {
                                            console.log('\nTipos de plantas agora no banco:');
                                            console.table(rows);
                                            console.log('====================================================================');
                                            console.log('CONFIGURAÇÃO DO BANCO DE DADOS CONCLUÍDA COM SUCESSO! 🎉');
                                            console.log('====================================================================');
                                        }

                                        // Fechamos a conexão com o banco de dados
                                        fecharConexao();
                                    });
                                });
                            });
                        }
                    });
                });
            });
        } else {
            console.log(`✅ A tabela tipos_planta já contém dados (${row.count} registros). Não é necessário adicionar dados iniciais.`);

            // Exibimos os tipos de plantas existentes
            db.all('SELECT * FROM tipos_planta ORDER BY id', [], (err, rows) => {
                if (err) {
                    console.error(`❌ Erro ao consultar tipos de plantas: ${err.message}`);
                } else {
                    console.log('\nTipos de plantas existentes no banco:');
                    console.table(rows);
                    console.log('====================================================================');
                    console.log('CONFIGURAÇÃO DO BANCO DE DADOS CONCLUÍDA! 🎉');
                    console.log('====================================================================');
                }

                // Fechamos a conexão com o banco de dados
                fecharConexao();
            });
        }
    });
}

// Função para fechar a conexão com o banco de dados
function fecharConexao() {
    console.log('\nFechando conexão com o banco de dados...');
    db.close((err) => {
        if (err) {
            console.error(`❌ Erro ao fechar banco de dados: ${err.message}`);
        } else {
            console.log('✅ Conexão com o banco de dados fechada com sucesso.');
        }

        // Imprime a última mensagem do script
        console.log('\n📝 Script de configuração do banco de dados finalizado! O banco está pronto para uso pela API.');
    });
}

// Executamos o script diretamente
if (require.main === module) {
    console.log('Script sendo executado diretamente.');
    // O fluxo principal já é iniciado na conexão com o banco
}

// Exportamos o banco de dados para possível uso em outros módulos
export default db;