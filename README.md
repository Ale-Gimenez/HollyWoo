# Filminis — Projeto Integrado (Frontend + Backend)

Projeto unificado com o frontend React (Vite) conectado ao backend FastAPI via proxy.

---

## Estrutura

```
filminis_integrado/
├── backend/        → FastAPI + SQLAlchemy + MySQL
└── frontend/       → React + Vite
```

---

## Como rodar

### 1. Backend

```bash
cd backend

# Crie e ative o ambiente virtual
python -m venv .venv
source .venv/bin/activate        # Linux/Mac
.venv\Scripts\activate           # Windows

# Instale dependências
pip install -r requirements.txt

# Configure o banco de dados no .env
# (edite o arquivo .env com suas credenciais MySQL)

# Antes de iniciar o servidor coloque o banco
# Inicie o servidor
uvicorn app.main:app --reload --port 8000
```

O backend ficará disponível em: http://localhost:8000  
Documentação automática: http://localhost:8000/docs

---

### 2. Banco MySQL
# Rode o seguinte comando (criar tabelas e população)
mysql -u root -p < hollywoo-DDL-DML.sql

Caso não der certo coloque o arquivo hollywoo-DDL-DML.sql no Workbench e rode clicando no raio

| Role  | E-mail               | Senha    |
|-------|----------------------|----------|
| admin | admin@hollywoo.com   | admin123 |
| user  | mary@email.com       | senha123 |


### 3. Frontend

```bash
cd frontend

# Instale dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend ficará disponível em: http://localhost:5173

> O Vite está configurado com proxy: todas as chamadas `/api/*` são redirecionadas automaticamente para `http://localhost:8000`.

---

## Variáveis de ambiente

### Backend (`backend/.env`)
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=senai
DB_NAME=filminis
SECRET_KEY=39226a7ef8fb360d091bb4fb47ed3ccfab235817c994b3a9d19abee34d9ee6f5
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:8000
```

---

## Como a integração funciona

- O `vite.config.js` configura um proxy: requisições para `/api/*` são repassadas ao backend
- O `src/service/api.js` centraliza todas as chamadas HTTP
- O `AuthContext` usa JWT: salva `access_token` e `refresh_token` no `localStorage`
- O `FilmesContext` busca filmes aprovados do endpoint `GET /filmes`
- Login, cadastro e logout chamam os endpoints `/auth/*`
- Filmes pendentes (sugestões) usam `GET /filmes/pendentes` — requer admin

---

## Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/register | Cadastro de usuário |
| POST | /auth/login | Login (retorna JWT) |
| POST | /auth/logout | Logout (invalida refresh token) |
| GET | /usuarios/me | Dados do usuário logado |
| GET | /filmes | Lista filmes aprovados |
| GET | /filmes/{id} | Detalhes de um filme |
| POST | /filmes | Criar filme (autenticado) |
| PUT | /filmes/{id}/aprovar | Aprovar filme (admin) |
| GET | /filmes/pendentes | Filmes aguardando aprovação (admin) |
| GET | /dados/categorias | Lista categorias |
| GET | /home/destaques | Destaques da home |
