# an event

Aplicacao web para um evento com foco em lista de presentes e confirmacao de presenca. O projeto foi gerado a partir de uma base do Lovable e esta sendo customizado como uma landing page para um casal montar o novo lar.

## Framework utilizado

O projeto usa **React** com **Vite** e **TypeScript** como base principal.

Na interface, tambem aparecem:

- **Tailwind CSS** para estilizacao
- **shadcn/ui** e **Radix UI** para componentes
- **React Router** para roteamento
- **Vitest** para testes

## O que foi feito ate o momento

Atualmente a aplicacao ja possui:

- Hero principal com chamada para a lista de presentes e para a confirmacao de presenca
- Lista de presentes com itens predefinidos e valores
- Modal com QR Code Pix ao selecionar um presente
- Secao de RSVP com confirmacao local na interface
- Estrutura inicial de testes e configuracao de lint/build

Observacao: o QR Code Pix ainda usa uma chave placeholder e a confirmacao de presenca ainda nao envia dados para backend.

## Como rodar no Ubuntu

### 1. Instale o Node.js

Recomendo usar Node.js 20 ou superior.

```bash
sudo apt update
sudo apt install -y nodejs npm
node -v
npm -v
```

Se a versao do Node instalada pelo `apt` for antiga no seu Ubuntu, use `nvm` ou a distribuicao oficial do Node.js.

### 2. Entre na pasta do projeto

```bash
cd /home/mdsjjorge/Documents/FS_GITHUB/MINE/an-event
```

### 3. Instale as dependencias

```bash
npm install
```

### 4. Rode o servidor de desenvolvimento

```bash
npm run dev
```

Depois disso, abra no navegador o endereco exibido no terminal, normalmente:

```bash
http://localhost:5173
```

## Scripts uteis

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```
