# API de Plantas - Backend

![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.7+-blue)
![Express](https://img.shields.io/badge/Express-v4.21+-orange)
![SQLite](https://img.shields.io/badge/SQLite-v5.1+-lightgrey)

Uma API RESTful completa para gerenciar uma loja de plantas, construída com Node.js, Express e TypeScript, utilizando SQLite como banco de dados. Esta API oferece funcionalidades para listar, buscar e adicionar plantas, além de consultar tipos disponíveis.

## 📋 Índice

- [Características](#características)
- [Requisitos do Sistema](#requisitos-do-sistema)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Banco de Dados](#banco-de-dados)
    - [Esquema](#esquema)
    - [Dados Iniciais](#dados-iniciais)
    - [Migração e Backup](#migração-e-backup)
- [Endpoints da API](#endpoints-da-api)
    - [Plantas](#plantas)
    - [Tipos de Plantas](#tipos-de-plantas)
- [Modelos de Dados](#modelos-de-dados)
- [Middlewares](#middlewares)
- [Tratamento de Erros](#tratamento-de-erros)
- [Desenvolvimento](#desenvolvimento)
    - [Ambiente de Desenvolvimento](#ambiente-de-desenvolvimento)
    - [Convenções de Código](#convenções-de-código)
    - [Depuração](#depuração)
- [Implantação](#implantação)
- [Exemplos de Uso](#exemplos-de-uso)
- [Solução de Problemas](#solução-de-problemas)
- [Contribuição](#contribuição)
- [Licença](#licença)

## ✨ Características

- **Arquitetura MVC** (Model-View-Controller) para organização do código
- **API RESTful** completa com rotas para gerenciar plantas e seus tipos
- **Banco de dados SQLite** para armazenamento persistente sem necessidade de servidor externo
- **TypeScript** para tipagem estática e melhor segurança do código
- **Express** para roteamento HTTP e middlewares
- **Validação de dados** com YUP para garantir integridade dos dados de entrada
- **Inicialização automática** do banco de dados com dados iniciais
- **Suporte a CORS** para interação com frontend
- **Hot-reloading** para desenvolvimento mais eficiente

## 🖥️ Requisitos do Sistema

- Node.js (v18 ou superior)
- npm (v8 ou superior)
- Sistema operacional: Windows, macOS ou Linux

## 🚀 Instalação

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

### Configuração do Ambiente

Por padrão, o servidor utiliza a porta 3000. Você pode alterar isso definindo a variável de ambiente `PORT`:

```bash
# No Linux/macOS
export PORT=4000

# No Windows (CMD)
set PORT=4000

# No Windows (PowerShell)
$env:PORT=4000
```

### Inicialização do Banco de Dados

O banco de dados é criado e inicializado automaticamente na primeira execução. Para forçar uma reinicialização:

```bash
# Limpar o banco de dados e reconstruir
npm run reset:all
```

## 📜 Scripts Disponíveis

O projeto inclui os seguintes scripts npm:

| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia o servidor em modo produção usando ts-node |
| `npm run dev` | Inicia o servidor em modo desenvolvimento com auto-reload |
| `npm run build` | Compila o código TypeScript para JavaScript |
| `npm run lint` | Executa o linter para verificar o código |
| `npm run clean` | Remove node_modules, package-lock.json e pasta dist |
| `npm run clean:db` | Remove arquivos de banco de dados SQLite |
| `npm run reset` | Reinstala dependências e reconstrói o projeto |
| `npm run reset:all` | Limpa tudo (inclusive banco de dados) e reconstrói o projeto |

## 📁 Estrutura do Projeto

```
api-plantas-backend/
├── db/                       # Diretório do banco de dados SQLite (criado automaticamente)
│   └── plantas.db            # Arquivo do banco de dados SQLite
├── src/
│   ├── controllers/          # Controladores para manipulação das requisições
│   │   └── plantaController.ts  # Controlador para endpoints de plantas
│   ├── database/             # Configuração e inicialização do banco de dados
│   │   ├── database.ts       # Conexão com o banco de dados
│   │   ├── initDatabase.ts   # Inicialização do esquema do banco de dados
│   │   └── populateDatabase.ts # Script para popular o banco com dados de exemplo
│   ├── middlewares/          # Middlewares para validação e autenticação
│   │   └── validationMiddleware.ts # Validação de dados com Yup
│   ├── models/               # Modelos de dados e operações de banco
│   │   └── plantaModel.ts    # Modelo para manipulação de plantas no BD
│   └── routes/               # Definição das rotas da API
│       └── route.ts          # Rotas para os endpoints da API
├── server.ts                 # Arquivo principal do servidor
├── tsconfig.json             # Configuração do TypeScript
├── setup.sh                  # Script para configurar o ambiente
├── clean.sh                  # Script para limpeza do projeto
├── .gitignore                # Arquivos ignorados pelo git
├── package.json              # Dependências e scripts do projeto
└── README.md                 # Documentação do projeto
```

## 💾 Banco de Dados

### Esquema

O projeto utiliza SQLite como banco de dados, com as seguintes tabelas:

#### Tabela `tipos_planta`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária, autoincremento |
| nome | VARCHAR(100) | Nome do tipo de planta (ex: "Suculenta") |
| created_at | TIMESTAMP | Data/hora de criação |
| updated_at | TIMESTAMP | Data/hora da última atualização |

#### Tabela `plantas`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária, autoincremento |
| nome | VARCHAR(100) | Nome da planta |
| subtitulo | VARCHAR(200) | Descrição curta da planta |
| etiquetas | TEXT | Tags separadas por vírgula (ex: "interior,sombra") |
| preco | DECIMAL(10,2) | Preço da planta |
| esta_em_promocao | BOOLEAN | Se a planta está em promoção |
| porcentagem_desconto | DECIMAL(5,2) | Percentual do desconto (se em promoção) |
| caracteristicas | TEXT | Características da planta em formato de texto |
| descricao | TEXT | Descrição completa da planta |
| url_imagem | VARCHAR(255) | URL da imagem da planta |
| tipo_planta_id | INTEGER | Referência ao ID na tabela tipos_planta |
| created_at | TIMESTAMP | Data/hora de criação |
| updated_at | TIMESTAMP | Data/hora da última atualização |

#### Índices
- `idx_plantas_tipo_planta_id` - Índice na coluna tipo_planta_id
- `idx_plantas_esta_em_promocao` - Índice na coluna esta_em_promocao
- `idx_plantas_preco` - Índice na coluna preco

#### Views
- `view_plantas_promocao` - Visão que inclui todas as plantas em promoção com preço promocional calculado
- `view_relatorio_plantas_por_tipo` - Visão com estatísticas agrupadas por tipo de planta

#### Triggers
- `tipos_planta_updated_at` - Atualiza o campo updated_at quando um tipo de planta é alterado
- `plantas_updated_at` - Atualiza o campo updated_at quando uma planta é alterada

### Dados Iniciais

Na primeira inicialização, o banco de dados é populado com os seguintes tipos de plantas:

1. Plantas de Interior
2. Plantas de Exterior
3. Suculentas
4. Cactos
5. Árvores Frutíferas
6. Flores
7. Ervas Aromáticas

### Migração e Backup

#### Backup do Banco de Dados
```bash
# Manual backup
mkdir -p backups
sqlite3 db/plantas.db .dump > backups/plantas_$(date +%Y%m%d_%H%M%S).sql
```

#### Restauração do Banco de Dados
```bash
# Restaurar a partir de um backup
sqlite3 db/plantas.db < backups/plants_backup.sql
```

## 🌐 Endpoints da API

Todos os endpoints começam com o prefixo `/api`

### Plantas

#### Listar todas as plantas
- **URL**: `/api/plantas`
- **Método**: `GET`
- **Códigos de Resposta**:
    - `200 OK` - Retorna um array de plantas
    - `500 Internal Server Error` - Erro no servidor

**Exemplo de Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Espada de São Jorge",
    "subtitulo": "Planta ornamental resistente",
    "etiquetas": "interior,resistente,pouca água",
    "preco": 45.90,
    "esta_em_promocao": false,
    "caracteristicas": "Tolera pouca luz; Pouca água; Purifica o ar",
    "descricao": "A Espada de São Jorge é uma planta conhecida por...",
    "url_imagem": "https://exemplo.com/espada-sao-jorge.jpg",
    "tipo_planta_id": 1,
    "created_at": "2023-01-15T14:22:10.000Z",
    "updated_at": "2023-01-15T14:22:10.000Z"
  },
  // Mais plantas...
]
```

#### Buscar planta por ID
- **URL**: `/api/plantas/:id`
- **Método**: `GET`
- **Parâmetros de URL**:
    - `id` - ID da planta
- **Códigos de Resposta**:
    - `200 OK` - Retorna os detalhes da planta
    - `404 Not Found` - Planta não encontrada
    - `500 Internal Server Error` - Erro no servidor

**Exemplo de Resposta (200 OK):**
```json
{
  "id": 1,
  "nome": "Espada de São Jorge",
  "subtitulo": "Planta ornamental resistente",
  "etiquetas": "interior,resistente,pouca água",
  "preco": 45.90,
  "esta_em_promocao": false,
  "caracteristicas": "Tolera pouca luz; Pouca água; Purifica o ar",
  "descricao": "A Espada de São Jorge é uma planta conhecida por...",
  "url_imagem": "https://exemplo.com/espada-sao-jorge.jpg",
  "tipo_planta_id": 1,
  "created_at": "2023-01-15T14:22:10.000Z",
  "updated_at": "2023-01-15T14:22:10.000Z"
}
```

#### Adicionar nova planta
- **URL**: `/api/plantas`
- **Método**: `POST`
- **Cabeçalhos**:
    - `Content-Type: application/json`
- **Corpo da Requisição**: Dados da planta (JSON)
- **Códigos de Resposta**:
    - `201 Created` - Planta criada com sucesso
    - `400 Bad Request` - Dados inválidos
    - `500 Internal Server Error` - Erro no servidor

**Exemplo de Requisição:**
```json
{
  "nome": "Lírio da Paz",
  "subtitulo": "Planta elegante com flores brancas",
  "etiquetas": "interior,flores,sombra",
  "preco": 39.90,
  "esta_em_promocao": true,
  "porcentagem_desconto": 10,
  "caracteristicas": "Flores brancas; Baixa manutenção; Purifica o ar",
  "descricao": "O Lírio da Paz é uma planta tropical conhecida por suas flores brancas elegantes...",
  "url_imagem": "https://exemplo.com/lirio-paz.jpg",
  "tipo_planta_id": 1
}
```

**Exemplo de Resposta (201 Created):**
```json
{
  "message": "Planta adicionada com sucesso!",
  "planta": {
    "id": 8,
    "nome": "Lírio da Paz",
    "subtitulo": "Planta elegante com flores brancas",
    "etiquetas": "interior,flores,sombra",
    "preco": 39.90,
    "esta_em_promocao": 1,
    "porcentagem_desconto": 10,
    "caracteristicas": "Flores brancas; Baixa manutenção; Purifica o ar",
    "descricao": "O Lírio da Paz é uma planta tropical conhecida por suas flores brancas elegantes...",
    "url_imagem": "https://exemplo.com/lirio-paz.jpg",
    "tipo_planta_id": 1,
    "created_at": "2023-06-17T18:45:23.000Z",
    "updated_at": "2023-06-17T18:45:23.000Z"
  }
}
```

### Tipos de Plantas

#### Listar todos os tipos de plantas
- **URL**: `/api/tipos-planta`
- **Método**: `GET`
- **Códigos de Resposta**:
    - `200 OK` - Retorna um array de tipos de plantas
    - `500 Internal Server Error` - Erro no servidor

**Exemplo de Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Plantas de Interior",
    "created_at": "2023-01-15T14:20:45.000Z",
    "updated_at": "2023-01-15T14:20:45.000Z"
  },
  {
    "id": 2,
    "nome": "Plantas de Exterior",
    "created_at": "2023-01-15T14:20:45.000Z",
    "updated_at": "2023-01-15T14:20:45.000Z"
  },
  // Mais tipos...
]
```

## 📊 Modelos de Dados

### PlantaModel

O modelo `PlantaModel` encapsula todas as operações relacionadas às plantas e tipos de plantas no banco de dados.

#### Interfaces Principais

```typescript
interface Planta {
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

interface PlantaInput {
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

interface TipoPlanta {
  id: number;
  nome: string;
  created_at: string;
  updated_at: string;
}
```

#### Métodos Principais

- `buscarTodasPlantas()` - Retorna todas as plantas no banco de dados
- `buscarPlantaPorId(id)` - Busca uma planta específica pelo ID
- `criarPlanta(plantaData)` - Cria uma nova planta no banco de dados
- `buscarTiposPlantas()` - Retorna todos os tipos de plantas disponíveis

## 🛡️ Middlewares

### Validação de Dados

O middleware de validação utiliza a biblioteca Yup para garantir que os dados das requisições estejam corretos antes de processá-los.

#### Schema de Validação para Plantas

```typescript
const schema = yup.object({
  nome: yup.string().required('Nome é obrigatório'),
  subtitulo: yup.string().required('Subtítulo é obrigatório'),
  etiquetas: yup.string().required('Etiquetas são obrigatórias'),
  preco: yup.number()
      .required('Preço é obrigatório')
      .positive('Preço deve ser positivo'),
  caracteristicas: yup.string().required('Características são obrigatórias'),
  descricao: yup.string().required('Descrição é obrigatória'),
  url_imagem: yup.string().required('URL da imagem é obrigatória'),
  tipo_planta_id: yup.number()
      .required('Tipo de planta é obrigatório')
      .positive('ID do tipo de planta deve ser positivo'),
  esta_em_promocao: yup.boolean().optional(),
  porcentagem_desconto: yup.number().optional().when('esta_em_promocao', {
    is: true,
    then: (schema) => schema
        .required('Porcentagem de desconto é obrigatória quando está em promoção')
        .positive('Porcentagem de desconto deve ser positiva')
        .max(100, 'Porcentagem de desconto não pode ser maior que 100%')
  })
});
```

## 🚨 Tratamento de Erros

A API inclui tratamento de erros abrangente para garantir respostas consistentes em caso de falhas:

- Erros de validação retornam `400 Bad Request` com detalhes sobre os campos inválidos
- Recursos não encontrados retornam `404 Not Found`
- Erros internos retornam `500 Internal Server Error` com mensagens de diagnóstico

### Exemplo de resposta de erro de validação

```json
{
  "message": "Dados inválidos",
  "errors": [
    {
      "path": "nome",
      "message": "Nome é obrigatório"
    },
    {
      "path": "preco",
      "message": "Preço deve ser positivo"
    }
  ]
}
```

## 🔧 Desenvolvimento

### Ambiente de Desenvolvimento

Para começar a desenvolver no projeto:

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o servidor em modo desenvolvimento: `npm run dev`

O servidor será iniciado em modo de desenvolvimento com hot-reload, permitindo que você veja as alterações em tempo real.

### Convenções de Código

- Nomes de arquivos: camelCase (ex: `plantaModel.ts`)
- Nomes de classes: PascalCase (ex: `PlantaModel`)
- Nomes de funções e variáveis: camelCase (ex: `buscarPlantaPorId`)
- Tipos e interfaces: PascalCase (ex: `Planta`, `PlantaInput`)

### Depuração

#### Visual Studio Code

Um arquivo de configuração `.vscode/launch.json` está incluído para facilitar a depuração:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": ["${workspaceFolder}/server.ts"],
      "env": {
        "PORT": "3000"
      }
    }
  ]
}
```

## 🚀 Implantação

### Preparando para Produção

1. Compile o projeto: `npm run build`
2. Verifique a compilação: `node dist/server.js`

### Opções de Implantação

- **VPS/Servidor Dedicado**: Configure um servidor Node.js e execute o aplicativo compilado
- **Serviços em Nuvem**:
    - Heroku: `git push heroku master`
    - AWS Elastic Beanstalk: Configure para aplicações Node.js
    - Google Cloud Run: Deploy com Docker
    - Vercel ou Netlify: Configuração para API serverless

## 📝 Exemplos de Uso

### Adicionando uma nova planta com cURL

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

### Buscando todas as plantas com JavaScript/Fetch

```javascript
fetch('http://localhost:3000/api/plantas')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Erro:', error));
```

### Buscando tipos de plantas com Axios

```javascript
import axios from 'axios';

axios.get('http://localhost:3000/api/tipos-planta')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Erro ao buscar tipos de plantas:', error);
  });
```

## 🔍 Solução de Problemas

### Problemas Comuns

#### Erro de Porta em Uso
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solução**: A porta 3000 já está em uso. Você pode mudar a porta do servidor definindo a variável de ambiente PORT ou matando o processo que está usando a porta 3000:
```bash
# Verificar processos usando a porta 3000
lsof -i :3000 (Linux/Mac) ou netstat -ano | findstr :3000 (Windows)

# Matar o processo
kill <PID> (Linux/Mac) ou taskkill /F /PID <PID> (Windows)
```

#### Erro de Acesso ao Banco de Dados
```
Error: SQLITE_CANTOPEN: unable to open database file
```

**Solução**: Verifique se a pasta `db` existe e se o servidor tem permissão para escrever nela:
```bash
mkdir -p db
chmod 755 db
```

#### Erro de TypeScript
```
TS2307: Cannot find module '../database/database'
```

**Solução**: Verifique se o caminho de importação está correto e se o arquivo existe. No Windows, problemas de case-sensitivity podem ocorrer.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE.md para detalhes.

---

Desenvolvido com ❤️ por [Seu Nome](https://github.com/seu-usuario)
