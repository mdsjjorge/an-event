# an event front

Frontend da aplicacao `an event`, construido com React, Vite e TypeScript.

## Responsabilidades

- Renderizar a landing page do evento
- Consumir os endpoints do backend
- Exibir lista de presentes e QR Code Pix
- Enviar confirmacoes de presenca

## Dependencia da API

Por padrao, o frontend espera a API em:

```bash
http://localhost:3001/api
```

Se quiser alterar, ajuste o arquivo `.env`:

```bash
VITE_API_URL=http://localhost:3001/api
```

## Executar localmente

```bash
cp .env.example .env
npm install
npm run dev
```
