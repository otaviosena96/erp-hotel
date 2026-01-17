# My Hotel - Sistema de Gestão Hoteleira

Sistema Full Stack para gestão hoteleira.

## Pré-requisitos

Antes de começar, você precisa ter instalado:
- [Docker](https://docs.docker.com/get-docker/) - Para rodar os containers
- [Docker Compose](https://docs.docker.com/compose/install/) - Para orquestrar os serviços

## Como Rodar (Primeira Vez)

### 1. Clone o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd my-hotel
```

### 2. Configure o ambiente
Copie o arquivo de exemplo e renomeie:
```bash
cp docker-compose-example.yml docker-compose.yml
```

⚠️ **Importante:** Verifique se as configurações no `docker-compose.yml` estão corretas para seu ambiente.

### 3. Suba todos os serviços
```bash
docker-compose up -d --build
```

O `--build` é **necessário na primeira vez** para criar as imagens Docker do frontend e backend.

### 4. Acesse as aplicações
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Banco PostgreSQL: localhost:5432



Para reconstruir após mudanças no código:
```bash
docker-compose up -d --build
```

##  Rodar Sem Docker (Desenvolvimento Local)

### Pré-requisitos Adicionais
- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [PostgreSQL](https://www.postgresql.org/download/) rodando localmente

### 1. Backend
```bash
cd my-hotel-backend
npm install
```

Crie o arquivo `.env`:
```bash
cp .env.example .env
```

Configure o `.env` com suas credenciais:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
DB_DATABASE=hotel_db

# JWT
JWT_SECRET=sua_chave_secreta_aqui

# Porta do servidor
PORT=3001

# URL do Frontend (para CORS)
FRONTEND_URL=http://localhost:3000
```

Inicie o backend:
```bash
npm run start:dev
```

### 2. Frontend
```bash
cd my-hotel-front
npm install
```

Crie o arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Inicie o frontend:
```bash
npm run dev
```

### 3. Acesse as aplicações
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001


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
