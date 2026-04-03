# an event

Estrutura separada em duas pastas:

- `front`: aplicacao React + Vite que renderiza a landing page do evento
- `back`: API Express + TypeScript conectada ao MongoDB

## Endpoints criados

- `GET /api/health`
- `GET /api/event`
- `GET /api/gifts`
- `GET /api/rsvps`
- `POST /api/rsvps`

## Como subir o MongoDB

```bash
docker compose up -d
```

Observacao: o compose usa `mongo:7.0`, porque o MongoDB oficial nao oferece imagem Alpine estavel para esse fluxo.

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
