# API de Plantas - Backend

![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.7+-blue)
![Express](https://img.shields.io/badge/Express-v4.21+-orange)
![SQLite](https://img.shields.io/badge/SQLite-v5.1+-lightgrey)

Uma API RESTful para gerenciar uma loja de plantas, construída com Node.js, Express e TypeScript, utilizando SQLite como banco de dados.

## Testes:
    "🌐 API should be available at http://ec2-3-142-133-230.us-east-2.compute.amazonaws.com:3000/api/plantas"
    "🌐 API should be available at http://ec2-3-142-133-230.us-east-2.compute.amazonaws.com:3000/api/tipos-planta"
    "🌐 API should be available at http://ec2-3-142-133-230.us-east-2.compute.amazonaws.com:3000/api/plantas/1"

## Características

- **API RESTful** completa para gerenciar catálogo de plantas e tipos de plantas
- **TypeScript** para tipagem estática e melhor segurança do código
- **Banco de dados SQLite** para armazenamento persistente sem necessidade de configuração adicional
- **Arquitetura MVC** para organização clara do código
- **Validação de dados** com YUP para garantir integridade dos dados
- **Inicialização automática** do banco de dados com dados iniciais
- **Suporte a CORS** para integração com frontends

## Requisitos do Sistema

- Node.js (v18 ou superior)
- npm (v8 ou superior)

## Instalação

### Clonando o Repositório

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/api-plantas-backend.git

# Entrar no diretório do projeto
cd api-plantas-backend
```

### Instalação de Dependências

```bash
# Instalar dependências do projeto
npm install
```

### Inicialização do Banco de Dados

O banco de dados é criado e inicializado automaticamente na primeira execução. Se precisar recriá-lo:

```bash
# Limpar o banco de dados e reconstruir
npm run reset:all
```

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia o servidor em modo produção usando ts-node |
| `npm run dev` | Inicia o servidor em modo desenvolvimento com auto-reload |
| `npm run build` | Compila o código TypeScript para JavaScript |
| `npm run clean` | Remove node_modules, package-lock.json e pasta dist |
| `npm run clean:db` | Remove arquivos de banco de dados SQLite |
| `npm run reset` | Reinstala dependências e reconstrói o projeto |
| `npm run reset:all` | Limpa tudo (inclusive banco de dados) e reconstrói o projeto |

## Estrutura do Projeto

```
api-plantas-backend/
├── db/                       # Diretório do banco de dados SQLite (criado automaticamente)
├── src/
│   ├── controllers/          # Controladores para manipulação das requisições
│   │   └── plantaController.ts  # Controlador para endpoints de plantas
│   ├── database/             # Configuração e inicialização do banco de dados
│   │   ├── database.ts       # Conexão com o banco de dados
│   │   └── initDatabase.ts   # Inicialização do esquema e dados iniciais
│   ├── middlewares/          # Middlewares para validação e autenticação
│   │   └── validationMiddleware.ts # Validação de dados com Yup
│   ├── models/               # Modelos de dados e operações de banco
│   │   └── plantaModel.ts    # Modelo para manipulação de plantas no BD
│   └── routes/               # Definição das rotas da API
│       └── route.ts          # Rotas para os endpoints da API
├── server.ts                 # Arquivo principal do servidor
├── tsconfig.json             # Configuração do TypeScript
├── package.json              # Dependências e scripts do projeto
└── README.md                 # Documentação do projeto
```

## Banco de Dados

### Esquema

O projeto utiliza SQLite com as seguintes tabelas:

#### Tabela `tipos_planta`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária, autoincremento |
| nome | VARCHAR(100) | Nome do tipo de planta |
| created_at | TIMESTAMP | Data/hora de criação |
| updated_at | TIMESTAMP | Data/hora da última atualização |

#### Tabela `plantas`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária, autoincremento |
| nome | VARCHAR(100) | Nome da planta |
| subtitulo | VARCHAR(200) | Descrição curta da planta |
| etiquetas | TEXT | Tags separadas por vírgula |
| preco | DECIMAL(10,2) | Preço da planta |
| esta_em_promocao | BOOLEAN | Indica se está em promoção |
| porcentagem_desconto | DECIMAL(5,2) | Percentual do desconto (se em promoção) |
| caracteristicas | TEXT | Características da planta |
| descricao | TEXT | Descrição completa da planta |
| url_imagem | VARCHAR(255) | URL da imagem da planta |
| tipo_planta_id | INTEGER | Referência ao ID na tabela tipos_planta |
| created_at | TIMESTAMP | Data/hora de criação |
| updated_at | TIMESTAMP | Data/hora da última atualização |

### Dados Iniciais

Na primeira inicialização, o banco é populado com os seguintes tipos de plantas:

1. Plantas de Interior
2. Plantas de Exterior
3. Suculentas
4. Cactos
5. Árvores Frutíferas
6. Flores
7. Ervas Aromáticas

Também são adicionadas algumas plantas de exemplo.

## Endpoints da API

Todos os endpoints começam com o prefixo `/api`

### Plantas

#### Listar todas as plantas
- **URL**: `/api/plantas`
- **Método**: `GET`
- **Resposta**: Array de plantas

#### Buscar planta por ID
- **URL**: `/api/plantas/:id`
- **Método**: `GET`
- **Resposta**: Detalhes da planta com o ID especificado

#### Adicionar nova planta
- **URL**: `/api/plantas`
- **Método**: `POST`
- **Corpo**: Dados da planta em JSON
- **Resposta**: Planta criada com ID

### Tipos de Plantas

#### Listar todos os tipos de plantas
- **URL**: `/api/tipos-planta`
- **Método**: `GET`
- **Resposta**: Array de tipos de plantas

## Exemplos de Uso

### Exemplo de Requisição para Adicionar Planta

```bash
curl -X POST http://localhost:3000/api/plantas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Samambaia Americana",
    "subtitulo": "Planta pendente com folhas rendadas",
    "etiquetas": "interior,pendente,sombra",
    "preco": 35.90,
    "esta_em_promocao": false,
    "caracteristicas": "Folhas rendadas; Gosta de umidade; Crescimento médio",
    "descricao": "A Samambaia Americana é uma planta elegante com folhas delicadas em formato de renda...",
    "url_imagem": "https://exemplo.com/samambaia.jpg",
    "tipo_planta_id": 1
  }'
```

### Exemplo de Resposta

```json
{
  "id": 4,
  "nome": "Samambaia Americana",
  "subtitulo": "Planta pendente com folhas rendadas",
  "etiquetas": "interior,pendente,sombra",
  "preco": 35.90,
  "esta_em_promocao": 0,
  "porcentagem_desconto": null,
  "caracteristicas": "Folhas rendadas; Gosta de umidade; Crescimento médio",
  "descricao": "A Samambaia Americana é uma planta elegante com folhas delicadas em formato de renda...",
  "url_imagem": "https://exemplo.com/samambaia.jpg",
  "tipo_planta_id": 1,
  "created_at": "2025-02-25T12:34:56.789Z",
  "updated_at": "2025-02-25T12:34:56.789Z"
}
```

## Solução de Problemas

### Erro de Porta em Uso
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solução**: A porta 3000 já está em uso. Altere a porta definindo a variável de ambiente PORT:
```bash
PORT=3001 npm run dev
```

### Erro de Acesso ao Banco de Dados
```
Error: SQLITE_CANTOPEN: unable to open database file
```

**Solução**: Verifique se a pasta `db` existe e se o servidor tem permissão para escrever nela:
```bash
mkdir -p db
chmod 755 db
```


## Licença

Este projeto está licenciado sob a licença ISC - veja o arquivo LICENSE para detalhes.
