# Guia Generico de Uso do ngrok para Aplicacoes Full Stack

Este documento resume uma rotina pratica para expor aplicacoes locais na internet usando `ngrok`, principalmente para testes de frontend, backend e webhooks.

## Quando usar

Use `ngrok` quando voce precisa:

- disponibilizar um backend local para Webhooks
- compartilhar um frontend local com outra pessoa ou outro dispositivo
- testar integracoes com provedores externos que exigem uma URL publica
- validar callbacks de pagamento, autenticacao ou notificacoes

## Como o ngrok funciona

O `ngrok` cria um tunel seguro entre a internet e uma porta local da sua maquina. Em vez de abrir portas no roteador, voce executa um comando como:

```bash
ngrok http 3001
```

Isso gera uma URL publica `https://...ngrok.app` que encaminha as requisicoes para `http://localhost:3001`.

## Passo 1: criar conta

1. Acesse a pagina de cadastro:

```text
https://dashboard.ngrok.com/signup
```

2. Crie sua conta e faca login no dashboard.
3. Localize seu `authtoken` no painel do ngrok.

## Passo 2: baixar e instalar o ngrok

Consulte a documentacao oficial:

```text
https://ngrok.com/docs/getting-started/index
```

Opcoes comuns:

### Linux Debian/Ubuntu

```bash
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
  | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null

echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
  | sudo tee /etc/apt/sources.list.d/ngrok.list

sudo apt update
sudo apt install ngrok
```

### macOS

```bash
brew install ngrok
```

### Windows

Baixe pelo painel ou pela documentacao oficial e instale o binario do `ngrok`.

## Passo 3: conectar sua conta local

Depois de instalar, associe o agente local ao seu usuario:

```bash
ngrok config add-authtoken SEU_TOKEN_AQUI
```

Teste a instalacao:

```bash
ngrok version
ngrok help
```

## Rotina generica para apps full stack

Considere um projeto com:

- frontend em `http://localhost:8080`
- backend em `http://localhost:3001`

### Cenario A: expor apenas o backend

Use esse modo para Webhooks, APIs externas e callbacks de pagamento.

```bash
ngrok http 3001
```

Resultado esperado:

- o `ngrok` gera uma URL publica HTTPS
- requisicoes para essa URL chegam no seu backend local

Exemplo de uso:

```text
https://abc123.ngrok.app/api/webhook
```

### Cenario B: expor apenas o frontend

Use esse modo quando voce quer compartilhar a interface com outra pessoa.

```bash
ngrok http 8080
```

### Cenario C: frontend e backend separados

Quando o frontend chama o backend por URL absoluta, normalmente voce precisa de dois tuneis:

```bash
ngrok http 8080
ngrok http 3001
```

Nesse caso:

- um dominio publico aponta para o frontend
- outro dominio publico aponta para o backend

Se o frontend usa proxy do Vite ou do dev server para `/api`, muitas vezes basta expor so o frontend.

## Como escolher o que expor

Expose somente a porta necessaria:

- `backend` para webhooks e integracoes servidor-servidor
- `frontend` para demonstracao visual
- `frontend + backend` quando o navegador precisa chamar a API por URL publica separada

## Exemplo pratico para webhook

Suponha um backend local em `3001` com uma rota:

```text
POST /api/webhook
```

Abra o tunel:

```bash
ngrok http 3001
```

O `ngrok` vai mostrar algo parecido com:

```text
Forwarding https://abc123.ngrok.app -> http://localhost:3001
```

Entao a URL do webhook passa a ser:

```text
https://abc123.ngrok.app/api/webhook
```

Essa e a URL que deve ser cadastrada no servico externo.

## Exemplo pratico para um projeto full stack local

### Backend

```bash
cd back
npm run dev
```

ou:

```bash
cd back
npm run prod
```

### Frontend

```bash
cd front
npm run dev -- --host 0.0.0.0
```

### ngrok para o backend

```bash
ngrok http 3001
```

Se o webhook precisar chegar no backend, esse costuma ser o tunel mais importante.

## Variaveis de ambiente mais comuns

Exemplo generico:

```env
CLIENT_URL=http://localhost:8080,http://192.168.0.6:8080
VITE_API_URL=http://192.168.0.6:3001/api
WEBHOOK_URL=https://abc123.ngrok.app/api/webhook
```

Ajuste conforme a arquitetura do seu projeto.

## Dicas para frontend

- Se o frontend roda em outro dispositivo, nao use `localhost` em `VITE_API_URL`.
- `localhost` no navegador do celular significa o proprio celular.
- Use o IP da maquina na rede local ou um dominio publico do `ngrok`.

## Dicas para backend

- O backend precisa aceitar a origem correta no CORS.
- A URL do webhook deve ser HTTPS.
- O backend deve responder `200` rapidamente quando receber o webhook.

## Inspecionar requisicoes recebidas

O `ngrok` possui uma interface local de inspecao de trafego. Em muitos ambientes ela fica em:

```text
http://127.0.0.1:4040
```

Ali voce pode:

- ver requests recebidas
- inspecionar headers
- conferir body
- repetir chamadas manualmente

## Rotina recomendada para webhooks

1. Suba o backend localmente.
2. Abra `ngrok` para a porta do backend.
3. Copie a URL HTTPS publica.
4. Configure essa URL no provedor externo.
5. Execute o fluxo real.
6. Observe os logs do backend.
7. Confira no inspetor do `ngrok` se a requisicao chegou.
8. Ajuste o parser do payload conforme o formato real.

## Erros comuns

### O frontend abre, mas a API nao responde

Causa comum:

- `VITE_API_URL` aponta para `localhost`, mas o acesso esta sendo feito por outro dispositivo

Correcao:

- troque `localhost` pelo IP da maquina ou use um tunel publico adequado

### O webhook nao chega

Causas comuns:

- URL cadastrada sem HTTPS
- URL antiga do `ngrok`
- backend nao esta rodando
- rota incorreta

Correcao:

- regenere o tunel
- atualize a URL no provedor
- valide a rota com `curl`

### O backend recebe a request, mas o frontend nao reflete

Causas comuns:

- o backend nao atualizou o estado persistido
- o frontend nao consulta o status novamente
- a sessao/token nao bate com a order confirmada

## Comandos uteis

Criar tunel para porta local:

```bash
ngrok http 3001
```

Criar tunel para um endereco especifico na rede:

```bash
ngrok http 192.168.0.6:3001
```

Criar tunel para frontend:

```bash
ngrok http 8080
```

## Boas praticas

- nao exponha mais portas do que o necessario
- use tuneis separados quando frontend e backend precisarem de URLs independentes
- atualize variaveis de ambiente sempre que a URL do `ngrok` mudar
- nao confunda URL publica do `ngrok` com IP publico residencial
- para producao real, prefira infraestrutura propria com dominio fixo

## Fontes oficiais

- Cadastro no dashboard: https://dashboard.ngrok.com/signup
- Quickstart do agente: https://ngrok.com/docs/getting-started/index
- Tunel de localhost: https://ngrok.com/docs/guides/share-localhost/tunnels
- Endpoints HTTP/S: https://ngrok.com/docs/http
