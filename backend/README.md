# Adonis API application

This is the boilerplate for creating an API server in AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds

## Setup

or manually clone the repo and then run `npm install`.

### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```

### JWT

Para acessar rotas com autenticação é preciso fazer o login (email, password), recuperar o token e mandar no header em todas as outras requisições.
Header Authorization: "Bearer token". Note o espaço depois da palavra Bearer!

### Save vacancy

data: json com as informações da vaga.
image: imagem png, jpeg, jpg e etc.
