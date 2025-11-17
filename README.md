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
* **Documentação:** Swagger (OpenAPI)

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

# Segredo para assinar tokens JWT
JWT_SECRET="SEU_SEGREDO_SUPER_SEGURO_AQUI"

# Porta da aplicação (opcional, padrão 3001)
PORT=3001
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
- `npm run build`: Compila o código TypeScript para JavaScript (no diretório `dist`).
- `npm run lint`: Roda o ESLint para verificar erros de padrão de código.
- `npm run format`: Roda o Prettier para formatar o código.
- `npm run test`: Roda os testes unitários.
- `npm run test:e2e`: Roda os testes end-to-end.

---

## 📖 Documentação da API

### Swagger (OpenAPI)

A API é documentada com Swagger. Após subir a aplicação em ambiente de desenvolvimento, acesse:

- **Documentação Swagger UI:** `https://web-backend-sck9.onrender.com/docs`

Lá você poderá:
- Ver todos os endpoints disponíveis;
- Inspecionar os modelos de request/response;
- Testar chamadas autenticadas usando o botão `Authorize` com um token JWT.

> Observação: a rota `/api` pode estar configurada de forma diferente no seu `main.ts`. Ajuste a URL caso necessário.

---

## 🔐 Autenticação & Autorização

### Fluxo de Autenticação

A autenticação é baseada em JWT. O fluxo típico é:

1. Usuário se registra com `POST /auth/register`.
2. Usuário faz login com `POST /auth/login`.
3. A API devolve um token JWT.
4. O cliente envia esse token no header `Authorization: Bearer <token>` para acessar rotas protegidas.

### Endpoints de Auth (exemplo)

- `POST /auth/register`
  - Cria um novo usuário.
  - Body (exemplo):
    ```json
    {
      "name": "João Silva",
      "email": "joao@example.com",
      "password": "SenhaForte123",
      "age": 25
    }
    ```

- `POST /auth/login`
  - Faz a autenticação do usuário e retorna um token JWT.
  - Body (exemplo):
    ```json
    {
      "email": "joao@example.com",
      "password": "SenhaForte123"
    }
    ```
  - Resposta (exemplo):
    ```json
    {
      "access_token": "<JWT_AQUI>",
      "user": {
        "id": "uuid-do-usuario",
        "name": "João Silva",
        "email": "joao@example.com",
        "role": "CUSTOMER"
      }
    }
    ```

### Roles & Guards

- As rotas usam **guards** JWT para proteger recursos: `JwtAuthGuard`.
- Algumas rotas utilizam o decorator `@Roles(...)` para restringir o acesso a usuários com certos papéis (por exemplo, `ADMIN`, `SELLER`).
- O papel do usuário é armazenado no campo `role` do modelo `User` (enum `Role` no Prisma).

Exemplo de header de autorização:

```http
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

---

## 👤 Módulo de Usuários

### Modelo (User)

Campos principais (simplificado a partir do `schema.prisma`):

- `id: string` (UUID)
- `email: string` (único)
- `name: string`
- `password: string` (hash da senha)
- `role: Role` (`ADMIN`, `SELLER`, `CUSTOMER`)
- `age: number`
- `createdAt: Date`
- `updatedAt: Date`

### Endpoints principais

> As rotas abaixo geralmente exigem autenticação via JWT. Algumas também exigem `role` específico (por exemplo, `ADMIN`).

- `GET /user`
  - Lista de usuários (somente `ADMIN`).
  - Retorna um array de `UserEntity` (DTO de resposta, sem a senha).

- `GET /user/me`
  - Retorna os dados do usuário autenticado.

- `GET /user/:id`
  - Retorna um usuário específico (somente `ADMIN`).

- `PATCH /user/me`
  - Atualiza parcialmente os dados do usuário autenticado (por exemplo, nome, idade, etc.).

- `PATCH /user/:id`
  - Atualiza um usuário específico (somente `ADMIN`).

- `DELETE /user/:id`
  - Remove um usuário (somente `ADMIN`).

Exemplo de resposta (`UserEntity`):

```json
{
  "id": "uuid-do-usuario",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "CUSTOMER",
  "age": 25,
  "createdAt": "2025-11-16T10:00:00.000Z",
  "updatedAt": "2025-11-16T10:00:00.000Z"
}
```

---

## 🛒 Módulo de Produtos

### Modelo (Product)

Campos principais (simplificado):

- `id: string` (UUID)
- `name: string`
- `description: string | null`
- `price: number`
- `stock: number`
- `isAvailable: boolean`
- `imageUrl: string | null`
- `categoryId: string | null`
- `sellerId: string`
- `averageRating: number`
- `createdAt: Date`
- `updatedAt: Date`

### Endpoints principais

- `POST /products`
  - Cria um novo produto (geralmente restrito a `SELLER` ou `ADMIN`).

- `GET /products`
  - Lista paginada de produtos.
  - Aceita parâmetros de paginação via query string (ex.: `page`, `limit`).

- `GET /products/:id`
  - Retorna um produto específico.

- `PATCH /products/:id`
  - Atualiza um produto (geralmente restrito a quem criou ou `ADMIN`).

- `DELETE /products/:id`
  - Remove um produto (geralmente restrito a quem criou ou `ADMIN`).

Exemplo de resposta (produto):

```json
{
  "id": "uuid-do-produto",
  "name": "Camisa Esportiva",
  "description": "Camisa oficial do time X",
  "price": 199.9,
  "stock": 10,
  "isAvailable": true,
  "imageUrl": "https://example.com/camisa.png",
  "categoryId": "uuid-da-categoria",
  "sellerId": "uuid-do-vendedor",
  "averageRating": 4.5,
  "createdAt": "2025-11-16T10:00:00.000Z",
  "updatedAt": "2025-11-16T10:00:00.000Z"
}
```

---

## 📦 Módulo de Pedidos (Orders)

> A estrutura exata dos DTOs pode ser verificada no Swagger.

### Conceitos

- **Order**: representa um pedido feito por um usuário.
- **OrderItem**: representa um item (produto + quantidade) dentro de um pedido.

### Endpoints típicos

- `POST /orders`
  - Cria um novo pedido para o usuário autenticado.

- `GET /orders`
  - Lista todos os pedidos do usuário autenticado.
  - Admins podem ter visão ampla, dependendo da implementação.

- `GET /orders/:id`
  - Detalhes de um pedido específico.

- `PATCH /orders/:id/status`
  - Atualiza o status de um pedido (ex.: `PENDING`, `PAID`, `SHIPPED`, etc.).

---

## 🗂 Outros Módulos

Dependendo do que já está implementado no seu projeto, você também pode ter:

- **Categorias (`/category`)**
  - CRUD de categorias de produtos.

- **Avaliações (`/rating`)**
  - Usuários avaliam produtos (rating + comentário).

- **Endereços (`/adress`)**
  - Gerenciamento de endereços de entrega do usuário.

- **Métodos de Pagamento (`/payment-method`)**
  - Cadastro e gerenciamento de formas de pagamento do usuário.

- **Transações de Pagamento (`/payment-transaction`)**
  - Registro e status de pagamentos de pedidos.

- **Lista de Desejos (`/wish-list`)**
  - Produtos favoritados pelo usuário.

Use o Swagger para ver exatamente quais endpoints estão expostos e quais DTOs são esperados em cada rota.

---

## ❌ Formato de Erros

Os erros da API seguem, em geral, o padrão de exceções do Nest.js.

Exemplo de erro 404 (Not Found):

```json
{
  "statusCode": 404,
  "message": "User with ID 123 not found",
  "error": "Not Found"
}
```

Exemplo de erro 400 (Bad Request) com validação:

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request"
}
```

---

## ✅ Boas Práticas e Próximos Passos

- **Segurança:**
  - Mantenha o `JWT_SECRET` seguro e use valores diferentes para dev/produção.
  - Considere usar HTTPS em produção.

- **Logs & Monitoramento:**
  - Considere adicionar interceptors de logging e ferramentas de monitoramento.

- **Tests:**
  - Expanda os testes unitários e e2e em `test/`.

- **Documentação:**
  - Sempre que criar um novo módulo/endpoint, lembre-se de adicionar decorators do Swagger (`@ApiTags`, `@ApiOkResponse`, etc.) para manter a documentação sempre atualizada.

Se você quiser, posso ajudar a detalhar ainda mais a documentação de um módulo específico (por exemplo, Auth, Orders, Payment, etc.) com exemplos completos de request/response. 🙂
