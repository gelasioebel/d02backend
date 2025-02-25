# API de Plantas - Backend

Este é um servidor de API para gerenciar uma loja de plantas. O servidor é construído usando Node.js, Express e TypeScript, com um banco de dados SQLite.

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Execute o servidor:
```bash
npm run start
```

Para desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
├── db/                # Diretório do banco de dados SQLite
├── src/
│   ├── controllers/   # Controladores da API
│   ├── database/      # Configuração do banco de dados
│   ├── middlewares/   # Middlewares para validação e autenticação
│   ├── models/        # Modelos de dados
│   └── routes/        # Definição das rotas da API
├── server.ts          # Arquivo principal do servidor
├── tsconfig.json      # Configuração do TypeScript
└── package.json       # Dependências do projeto
```

## Endpoints da API

### Plantas

- **GET /api/plantas** - Listar todas as plantas
- **GET /api/plantas/:id** - Obter detalhes de uma planta específica
- **POST /api/plantas** - Adicionar uma nova planta

### Tipos de Plantas

- **GET /api/tipos-planta** - Listar todos os tipos de plantas

## Exemplo de dados para POST /api/plantas

```json
{
  "nome": "Espada de São Jorge",
  "subtitulo": "Planta ornamental resistente",
  "etiquetas": "interior,resistente,pouca água",
  "preco": 45.90,
  "esta_em_promocao": false,
  "caracteristicas": "Tolera pouca luz; Pouca água; Purifica o ar",
  "descricao": "A Espada de São Jorge é uma planta conhecida por ser muito resistente e de fácil manutenção.",
  "url_imagem": "https://exemplo.com/espada-sao-jorge.jpg",
  "tipo_planta_id": 1
}
```

## Banco de Dados

O banco de dados SQLite inclui as seguintes tabelas:

- **tipos_planta** - Categorias de plantas
- **plantas** - Detalhes das plantas

A API inicializa automaticamente o banco de dados com as tabelas necessárias na primeira execução.
