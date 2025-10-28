# [Nome do Projeto] - API de E-commerce

Este é o repositório do backend para o projeto de e-commerce de produtos esportivos. Esta API é construída com Nest.js e utiliza Prisma como ORM para se comunicar com um banco de dados PostgreSQL.

## Tecnologias Utilizadas

* **Framework:** Nest.js
* **ORM:** Prisma
* **Banco de Dados:** PostgreSQL
* **Linguagem:** TypeScript
* **Validação:** `class-validator` e `class-transformer`
* **Autenticação:** JWT (JSON Web Tokens) com Passport
* **Hashing de Senha:** `bcrypt`

---

## 🚀 Começando

Siga estes passos para configurar e rodar o projeto localmente.

### 1. Pré-requisitos

* **Node.js:** Versão 20.x ou superior. (Recomendamos usar um gerenciador de versões como o [NVM](https://github.com/nvm-sh/nvm)).
* **NPM:** Versão 10.x ou superior.
* **PostgreSQL:** Uma instância local do PostgreSQL rodando.
* **Git:** Para clonar o projeto.

### 2. Clonar o Repositório

```bash
git clone [URL_DO_SEU_REPOSITORIO_AQUI]
cd [NOME_DA_PASTA_DO_PROJETO]
```

### 3. Instalar Dependências

Este comando instalará o Nest.js, Prisma e todas as outras dependências listadas no package.json.

```bash
npm install
```

### 4. Configurar o Ambiente

Você precisa de um arquivo `.env` para armazenar suas variáveis de ambiente, como a string de conexão do banco de dados.

#### a. Crie o arquivo `.env`:

Você pode copiar o arquivo de exemplo (que deve estar no `.gitignore`):

```bash
cp .env.example .env
```

(Se você não tiver um `.env.example`, apenas crie um novo arquivo chamado `.env` na raiz do projeto.)

#### b. Edite o arquivo `.env`:

Adicione a sua string de conexão do PostgreSQL. O Prisma a usará para se conectar ao seu banco de dados local.

```bash
# .env

# Formato: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://edu:sua_senha_aqui@localhost:5432/web?schema=public"

# Adicione também um segredo para o JWT
JWT_SECRET="SEU_SEGREDO_SUPER_SEGURO_AQUI"
```

### 5. Configurar o Banco de Dados (Prisma)

Com seu arquivo `.env` configurado, você precisa dizer ao Prisma para "aplicar" o seu schema ao seu banco de dados local. Este comando lerá sua pasta `prisma/migrations` e criará todas as tabelas (como User, Product, etc.).

```bash
npx prisma migrate dev
```

### 6. Rodar a Aplicação

Agora você está pronto para iniciar o servidor de desenvolvimento.

```bash
npm run start:dev
```

O servidor estará rodando em modo "watch" (reinicia automaticamente a cada mudança) no endereço:  
**http://localhost:3001** (ou a porta definida no seu `main.ts`).

---

## 🏗️ Fluxo de Trabalho do Prisma (Migrações)

Sempre que você precisar alterar a estrutura do banco de dados (criar uma nova tabela ou modificar uma existente), siga estes dois passos:

1. **Modifique o Schema:** Edite o arquivo `prisma/schema.prisma`.
2. **Rode a Migração:** Execute o comando `migrate dev`, dando um nome descritivo para a sua mudança.

```bash
# Exemplo de criação de uma nova tabela de Produtos
npx prisma migrate dev --name add-product-model

# Exemplo de adição de uma coluna em uma tabela existente
npx prisma migrate dev --name add-stock-to-product
```

### Resetar o Banco de Desenvolvimento

Se em algum momento seu banco de dados local ficar "sujo" ou inconsistente, você pode resetá-lo completamente com este comando (⚠️ APAGA TODOS OS DADOS):

```bash
npx prisma migrate reset
```

---

## 📜 Scripts Principais do package.json

- `npm run start:dev`: Inicia a aplicação em modo de desenvolvimento com "watch".
- `npm run start:prod`: Inicia a aplicação em modo de produção (requer `npm run build` primeiro).
- `npm run build`: Compila o código TypeScript para JavaScript (no diretório dist).
- `npm run lint`: Roda o ESLint para verificar erros de padrão de código.
- `npm run format`: Roda o Prettier para formatar o código.

---

## 📡 Endpoints da API (Exemplos)

- `POST /auth/register`: Cria um novo usuário.
- `POST /auth/login`: Autentica um usuário e retorna um JWT.
- `GET /users/me`: (Protegido) Retorna o perfil do usuário logado.
