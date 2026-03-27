# Navega Express

Sistema com frontend em Next.js e backend em Express + Prisma para venda e gestao de passagens.

## Estrutura

- `frontend/`: aplicacao web (Next.js)
- `backend/`: API (Express + Prisma + PostgreSQL)

## Requisitos

- Node.js 20+
- npm
- PostgreSQL

## Configuracao rapida

1. Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

2. Frontend (em outro terminal)
```bash
cd frontend
npm install
npm run dev
```

Frontend padrao: `http://localhost:3002`  
Backend padrao: `http://localhost:3001`

## Variaveis de ambiente do backend

Arquivo: `backend/.env`

- `DATABASE_URL`: conexao PostgreSQL
- `PORT`: porta da API
- `JWT_SECRET`: segredo para JWT
- `ASAAS_API_URL`: URL da API Asaas
- `ASAAS_API_KEY`: chave da API Asaas
