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

```bash
cd back
npm run build
npm start
```

## Como conectar sua conta do Mercado Pago

1. Entre na sua conta do Mercado Pago Developers.
2. Abra a area de credenciais da aplicacao que vai gerar Pix.
3. Copie o `Access Token` de teste da aplicacao.
4. No arquivo `back/.env`, preencha:

```bash
MERCADO_PAGO_ENVIRONMENT=test
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-SEU_ACCESS_TOKEN_DE_TESTE
MP_STORE_ID=75539883
MP_POS_EXTERNAL_ID=LOJ001POS001
MP_STORE_EXTERNAL_ID=LOJ001
MP_STORE_NAME=An event
```

5. Se quiser receber notificacoes do Mercado Pago, preencha tambem:

```bash
PIX_NOTIFICATION_URL=https://seu-endpoint-publico/webhooks/mercado-pago
```

6. Reinicie o backend para aplicar as variaveis.

Observacoes:

- O fluxo atual cria `orders` QR dinamicas em `/v1/orders`, seguindo a documentacao oficial de QR presencial.
- Os campos monetarios enviados ao Mercado Pago saem como `string`: `total_amount`, `items.unit_price` e `transactions.payments.amount`.
- A idempotencia e gerada dinamicamente por operacao com prefixo do projeto, id do gift, valor e referencia externa.
- O frontend nao precisa da public key para esse fluxo atual, porque a geracao da order acontece no backend.

## Skills

Criar uma skill faz sentido se voce pretende repetir integracoes ou manutencoes do Mercado Pago em outros projetos.

Boa opcao de skill:

- uma skill `mercado-pago-qr-orders` que use `back/src/seed/mpago.pix.doc.md` e `back/src/seed/mpago.pagamento.doc.md` como referencias locais para orientar criacao de orders, idempotencia e validacao de payloads.

Para este projeto atual, eu manteria primeiro a implementacao funcionando no codigo. Depois, se quiser, eu posso transformar esse fluxo em skill reutilizavel.

## Como rodar o frontend

```bash
cd front
cp .env.example .env
npm install
npm run dev
```
