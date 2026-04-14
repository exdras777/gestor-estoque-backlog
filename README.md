# StockManager

Sistema de gerenciamento de estoque construído com **Next.js 16** e **SSR (Server-Side Rendering)**. Permite cadastrar, editar, excluir e monitorar produtos, com uma tela de backlog para controle de reposição de estoque.

---

## Sumário

- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Rotas da Aplicação](#rotas-da-aplicação)
- [API REST](#api-rest)
- [Modelo de Dados](#modelo-de-dados)
- [Banco de Dados](#banco-de-dados)
- [Arquitetura](#arquitetura)
- [Design System](#design-system)

---

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 16.1.6 | Framework principal (SSR + App Router) |
| React | 19.2.3 | Interface do usuário |
| TypeScript | 5 | Tipagem estática |
| Tailwind CSS | 4 | Utilitários de CSS |
| Node.js | — | Runtime do servidor |

Sem banco de dados externo — os dados são persistidos em um arquivo JSON local.

---

## Funcionalidades

### Produtos (`/products`)
- Cadastrar produtos com nome, descrição, preço, estoque e categoria
- Editar produtos via modal inline
- Excluir produtos com confirmação
- Busca em tempo real por nome ou descrição
- Filtro por categoria
- Indicadores visuais de estoque (crítico / baixo / normal)
- Dashboard com 4 métricas: total de produtos, unidades em estoque, valor do inventário e itens sem estoque

### Backlog (`/backlog`)
- Lista todos os produtos com estoque igual ou abaixo de 15 unidades
- 3 níveis de prioridade: Crítico (0 un.), Urgente (1–5 un.) e Atenção (6–15 un.)
- Filtro interativo por nível de prioridade
- Busca por nome ou categoria
- Sugestão automática de quantidade para reposição
- Dashboard com 5 métricas: total em backlog, crítico, urgente, atenção e percentual do inventário.

---

## Estrutura do Projeto

```
nextJS/
├── app/
│   ├── api/
│   │   └── products/
│   │       └── route.ts          # API REST (GET, POST, PUT, DELETE)
│   ├── backend/
│   │   ├── db.ts                 # Camada de persistência (JSON)
│   │   └── products.ts           # Server Actions (lógica de negócio)
│   ├── backlog/
│   │   └── page.tsx              # Tela de backlog de estoque
│   ├── frontend/
│   │   ├── components/
│   │   │   ├── BacklogList.tsx   # Componente interativo do backlog
│   │   │   ├── ProductForm.tsx   # Formulário de criação/edição
│   │   │   └── ProductList.tsx   # Tabela de produtos com busca e filtros
│   │   └── styles/
│   │       └── globals.css       # Estilos globais e design system
│   ├── products/
│   │   └── page.tsx              # Tela principal de produtos
│   ├── types/
│   │   └── product.ts            # Interfaces TypeScript
│   ├── layout.tsx                # Layout raiz
│   └── page.tsx                  # Landing page
├── .data/
│   └── products.json             # Banco de dados (gerado automaticamente)
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## Como Executar

**Pré-requisito:** Node.js 18 ou superior.

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse em: `http://localhost:3008`

### Scripts disponíveis

```bash
npm run dev      # Servidor de desenvolvimento (porta 3008, Turbopack)
npm run build    # Build de produção
npm run start    # Inicia o servidor de produção
npm run lint     # Verifica erros de lint
```

---

## Rotas da Aplicação

| Rota | Tipo | Descrição |
|---|---|---|
| `/` | Server Component | Landing page com visão geral do sistema |
| `/products` | Server Component | Gerenciamento completo de produtos |
| `/backlog` | Server Component | Produtos com estoque crítico ou baixo |
| `/api/products` | API Route | Endpoints REST para operações CRUD |

---

## API REST

Base URL: `/api/products`

### GET `/api/products`
Retorna todos os produtos.

**Resposta `200`:**
```json
[
  {
    "id": "1773102081486",
    "name": "Notebook Dell XPS",
    "description": "Notebook premium 15 polegadas",
    "price": 8999.99,
    "stock": 12,
    "category": "electronics",
    "createdAt": "2026-01-10T00:00:00.000Z",
    "updatedAt": "2026-01-10T00:00:00.000Z"
  }
]
```

---

### POST `/api/products`
Cria um novo produto.

**Body:**
```json
{
  "name": "Notebook Dell XPS",
  "description": "Opcional",
  "price": 8999.99,
  "stock": 10,
  "category": "electronics"
}
```

**Resposta `201`:** objeto do produto criado.

**Validações (servidor):**
- `name` é obrigatório e não pode estar vazio
- `price` deve ser maior ou igual a 0
- `stock` deve ser maior ou igual a 0

---

### PUT `/api/products`
Atualiza um produto existente.

**Body:**
```json
{
  "id": "1773102081486",
  "name": "Novo nome",
  "price": 7500.00,
  "stock": 5
}
```

**Resposta `200`:** objeto do produto atualizado.
**Resposta `404`:** produto não encontrado.

---

### DELETE `/api/products`
Remove um produto.

**Body:**
```json
{ "id": "1773102081486" }
```

**Resposta `200`:** `{ "success": true }`
**Resposta `404`:** produto não encontrado.

---

## Modelo de Dados

```typescript
interface Product {
  id: string;          // Timestamp em string (Date.now())
  name: string;        // Nome do produto (obrigatório)
  description: string; // Descrição (opcional)
  price: number;       // Preço em reais
  stock: number;       // Quantidade em estoque
  category: string;    // Categoria (ver lista abaixo)
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
}
```

### Categorias disponíveis

| Valor | Label |
|---|---|
| `electronics` | Eletrônicos |
| `clothing` | Roupas |
| `food` | Alimentos |
| `books` | Livros |
| `other` | Outro |

---

## Banco de Dados

Os dados são persistidos no arquivo `.data/products.json` na raiz do projeto. O diretório e o arquivo são criados automaticamente na primeira operação de escrita.

```
.data/
└── products.json   # Array JSON com todos os produtos
```

A camada de acesso (`app/backend/db.ts`) expõe duas funções:

```typescript
readFromDatabase<T>(file: string): Promise<T[]>
writeToDatabase<T>(file: string, data: T[]): Promise<void>
```

---

## Arquitetura

O projeto segue uma separação clara entre frontend e backend dentro do App Router do Next.js:

```
Requisição do usuário
        │
        ▼
  Server Component (page.tsx)
        │  chama Server Actions
        ▼
  app/backend/products.ts   ←── lógica de negócio, validação
        │
        ▼
  app/backend/db.ts         ←── leitura/escrita no JSON
        │
        ▼
   .data/products.json
```

Componentes client (`'use client'`) comunicam-se via fetch para `/api/products`, que por sua vez também delega para os Server Actions.

### Fluxo de renderização

- As páginas (`/products`, `/backlog`) são **Server Components**: buscam os dados no servidor antes de enviar o HTML ao navegador.
- Os componentes interativos (`ProductList`, `ProductForm`, `BacklogList`) são **Client Components**: recebem os dados via props e gerenciam estado local para busca, filtros e modais.

---

## Design System

### Paleta de cores

| Variável CSS | Valor | Uso |
|---|---|---|
| `--verde-escuro` | `#0c1f12` | Navbar, headers, botão primário |
| `--verde-medio` | `#1a3a20` | Fundos secundários |
| `--verde-claro` | `#2d6a3f` | Hover, bordas de foco |
| `--ouro` | `#c8921a` | Destaques, botão editar |
| `--ouro-claro` | `#e8b84b` | Marca, acentos |
| `--creme` | `#f7f2e8` | Background da aplicação |
| `--erro` | `#c0392b` | Alertas, botão excluir |
| `--sucesso` | `#1e7e3e` | Confirmações |

### Tipografia

| Fonte | Uso |
|---|---|
| Playfair Display | Títulos e headings |
| IBM Plex Sans | Corpo de texto e labels |
| IBM Plex Mono | Valores numéricos e preços |

### Indicadores de estoque

| Estoque | Cor | Status |
|---|---|---|
| 0 | Vermelho | Esgotado |
| 1–5 | Vermelho escuro | Crítico |
| 6–15 | Laranja/Amarelo | Urgente / Atenção |
| 16+ | Verde | Normal |
