const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const app = require('../index');

let servidor;
let base;

before(async () => {
    servidor = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => servidor.once('listening', resolve));
    base = `http://127.0.0.1:${servidor.address().port}`;
});

after(() => new Promise((resolve, reject) => servidor.close((erro) => erro ? reject(erro) : resolve())));

async function get(caminho) {
    const resposta = await fetch(`${base}${caminho}`);
    return { resposta, corpo: await resposta.json() };
}

test('lista livros e consulta um capítulo', async () => {
    const lista = await get('/api/livros?testamento=novo');
    assert.equal(lista.resposta.status, 200);
    assert.equal(lista.resposta.headers.get('x-content-type-options'), 'nosniff');
    assert.match(lista.resposta.headers.get('ratelimit'), /300-in-15min/);
    assert.equal(lista.corpo.length, 27);

    const capitulo = await get(`/api/livros/${encodeURIComponent('João')}/capitulos/3?inicio=1&fim=2`);
    assert.equal(capitulo.resposta.status, 200);
    assert.equal(capitulo.corpo.versiculos.length, 2);
    assert.match(capitulo.corpo.texto, /^1\./);
});

test('publica a documentação OpenAPI e o Swagger UI', async () => {
    const especificacao = await get('/swagger.json');
    assert.equal(especificacao.resposta.status, 200);
    assert.equal(especificacao.corpo.openapi, '3.0.3');
    assert.ok(especificacao.corpo.paths['/api/livros/{livro}/capitulos/{capitulo}']);

    const interfaceSwagger = await fetch(`${base}/api-docs/`);
    assert.equal(interfaceSwagger.status, 200);
    assert.match(await interfaceSwagger.text(), /Swagger UI/);
});

test('retorna erros HTTP úteis', async () => {
    const livro = await get('/api/livros/inexistente');
    assert.equal(livro.resposta.status, 404);

    const intervalo = await get('/api/livros/Joao/capitulos/3?inicio=2&fim=999');
    assert.equal(intervalo.resposta.status, 400);
});
