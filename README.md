# My Hotel - Sistema de Gestão Hoteleira

Sistema Full Stack para gestão hoteleira.

## 🚀 Como Rodar

### Com Docker (Recomendado)

1. **Suba todos os serviços:**
```bash
docker-compose up -d
```

2. **Acesse as aplicações:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Banco PostgreSQL: localhost:5432

### Sem Docker

1. **Backend:**
```bash
cd my-hotel-backend
npm install
npm run start:dev
```

2. **Frontend:**
```bash
cd my-hotel-front
npm install
npm run dev
```

## 🔐 Login

- **Usuário:** admin
- **Senha:** 123456

## 📋 Funcionalidades

- ✅ Login com JWT
- ✅ Cadastro de Hotéis
- ✅ Cadastro de Reservas  
- ✅ Cadastro de Hóspedes
- ✅ Containerização Docker

## 🛠 Stack

- **Backend:** Node.js + NestJS + PostgreSQL
- **Frontend:** React.js + Next.js + TailwindCSS
- **Infra:** Docker + Docker Compose
