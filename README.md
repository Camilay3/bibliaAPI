# Bíblia API

API HTTP em Node.js com os 73 livros da Bíblia em português.

## Rodando localmente

```bash
npm install
npm start
```

Por padrão, a API fica em `http://localhost:3020`. Para trocar a porta:

```bash
PORT=3000 npm start
```

Modo de desenvolvimento (reinício nativo do Node.js):

```bash
npm run dev
```

## Produção e segurança

A API já envia headers de segurança, limita cada IP a 300 requisições por 15 minutos, rejeita URLs maiores que 2048 caracteres e encerra conexões lentas. O limite pode ser alterado com `RATE_LIMIT`.

Para publicar atrás de um proxy reverso com HTTPS:

```bash
NODE_ENV=production REQUIRE_HTTPS=true TRUST_PROXY=1 npm start
```

`TRUST_PROXY` só deve ser usado quando a aplicação não estiver acessível diretamente pela internet. Para restringir navegadores a uma origem específica, defina `CORS_ORIGIN`; sem essa variável, a API pública aceita qualquer origem.

## Swagger / OpenAPI

Com a API rodando, abra a documentação interativa em:

`http://localhost:3020/api-docs`

O documento OpenAPI em JSON fica disponível em:

`http://localhost:3020/swagger.json`

## Endpoints

`GET /` retorna informações e os endpoints disponíveis.

`GET /api/livros` lista os livros. Filtre por testamento com `?testamento=antigo` ou `?testamento=novo`.

`GET /api/livros/:livro` retorna os dados do livro e a quantidade de versículos por capítulo. O livro pode ser identificado por nome, abreviação ou ID:

```bash
curl http://localhost:3020/api/livros/Joao
curl http://localhost:3020/api/livros/43
```

`GET /api/livros/:livro/capitulos/:capitulo` retorna os versículos e o texto agrupado. Use `inicio` e `fim` para selecionar um intervalo:

```bash
curl 'http://localhost:3020/api/livros/Joao/capitulos/3?inicio=1&fim=5'
```

As respostas são JSON. A API aceita requisições de origens diferentes e retorna `400` para parâmetros inválidos, `404` para livro/capítulo inexistente e `500` para falhas internas.

## Testes

```bash
npm test
```
