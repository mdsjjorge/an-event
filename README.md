# an event

Estrutura separada em duas pastas:

- `front`: aplicacao React + Vite que renderiza a landing page do evento
- `back`: API Express + TypeScript conectada ao MongoDB

## Endpoints criados

- `GET /api/health`
- `GET /api/event`
- `GET /api/gifts`
- `POST /api/gifts`
- `GET /api/rsvps`
- `POST /api/rsvps`

## Como subir o MongoDB

```bash
docker compose up -d
```

## Como rodar o backend

```bash
cd back
cp .env.example .env
npm install
npm run dev
```

## Como rodar o frontend

```bash
cd front
cp .env.example .env
npm install
npm run dev
```
