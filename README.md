# an event

Estrutura separada em duas pastas:

- `front`: aplicacao React + Vite que renderiza a landing page do evento
- `back`: API Express + TypeScript conectada ao MongoDB

## Endpoints criados

- `GET /api/health`
- `GET /api/event`
- `GET /api/gifts`
- `POST /api/gifts`
- `POST /api/payments/pix`
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

## Como conectar sua conta do Mercado Pago

1. Entre na sua conta do Mercado Pago Developers.
2. Abra a area de credenciais da aplicacao que vai gerar Pix.
3. Copie o `Access Token` do ambiente desejado.
4. No arquivo `back/.env`, preencha:

```bash
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-SEU_ACCESS_TOKEN
```

5. Se quiser receber notificacoes do Mercado Pago, preencha tambem:

```bash
PIX_NOTIFICATION_URL=https://seu-endpoint-publico/webhooks/mercado-pago
```

6. Reinicie o backend para aplicar as variaveis.

Observacoes:

- Para testes, use as credenciais de teste da sua conta.
- Para cobrancas reais, troque para as credenciais de producao.
- O frontend nao precisa da public key para esse fluxo atual, porque a geracao do Pix acontece no backend.

## Como rodar o frontend

```bash
cd front
cp .env.example .env
npm install
npm run dev
```
