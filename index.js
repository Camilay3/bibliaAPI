const express = require('express');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const fun = require('./class');
const antigo = require('./textosAntigo');
const novo = require('./textosNovo');
const swaggerDocument = require('./swagger');

const app = express();
const corsOrigin = process.env.CORS_ORIGIN || '*';
const testamentos = { antigo: antigo.livros, novo: novo.livros };
const livros = Object.entries(testamentos).flatMap(([testamento, lista]) =>
    lista.map((livro) => ({ livro, testamento }))
);

app.disable('x-powered-by');
app.use(helmet());
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    if (corsOrigin !== '*') res.vary('Origin');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});
app.use((req, res, next) => {
    if (req.originalUrl.length > 2048) return res.status(414).json({ erro: 'URL muito longa' });
    next();
});
// ponytail: store em memória, suficiente para uma instância; use store compartilhado ao escalar.
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: Number(process.env.RATE_LIMIT) || 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { erro: 'Muitas requisições. Tente novamente mais tarde.' }
}));
if (process.env.TRUST_PROXY) {
    app.set('trust proxy', process.env.TRUST_PROXY === 'true'
        ? true
        : Number(process.env.TRUST_PROXY));
}
if (process.env.REQUIRE_HTTPS === 'true') {
    app.use((req, res, next) => {
        if (req.secure) return next();
        res.status(426).json({ erro: 'HTTPS obrigatório' });
    });
}
app.get('/swagger.json', (req, res) => res.json(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

function normalizar(valor) {
    return String(valor).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function resumo(item) {
    return {
        id: item.livro.id,
        nome: item.livro.nome,
        abreviacao: item.livro.abr,
        capitulos: item.livro.capitulos,
        testamento: item.testamento
    };
}

function encontrarLivro(identificador) {
    const procurado = normalizar(identificador);
    return livros.find(({ livro }) => [livro.id, livro.nome, livro.abr]
        .some((valor) => normalizar(valor) === procurado));
}

function numero(valor, nome) {
    const convertido = Number(valor);
    if (!/^[1-9]\d*$/.test(String(valor)) || !Number.isSafeInteger(convertido)) {
        const erro = new Error(`${nome} deve ser um número inteiro positivo`);
        erro.status = 400;
        throw erro;
    }
    return convertido;
}

app.get('/', (req, res) => res.json({
    nome: 'Bíblia API',
    versao: '2.0.0',
    endpoints: {
        livros: '/api/livros',
        livro: '/api/livros/:livro',
        capitulo: '/api/livros/:livro/capitulos/:capitulo',
        documentacao: '/api-docs'
    }
}));

app.get('/api/livros', (req, res, next) => {
    try {
        const testamento = req.query.testamento;
        if (testamento && !Object.hasOwn(testamentos, testamento)) {
            const erro = new Error('testamento deve ser "antigo" ou "novo"');
            erro.status = 400;
            throw erro;
        }

        res.json(livros
            .filter((item) => !testamento || item.testamento === testamento)
            .map(resumo));
    } catch (erro) {
        next(erro);
    }
});

app.get('/api/livros/:livro', (req, res) => {
    const item = encontrarLivro(req.params.livro);
    if (!item) return res.status(404).json({ erro: 'Livro não encontrado' });

    res.json({
        livro: resumo(item),
        capitulos: Array.from({ length: item.livro.capitulos }, (_, indice) => ({
            numero: indice + 1,
            versiculos: item.livro.leitura[indice + 1].versi
        }))
    });
});

app.get('/api/livros/:livro/capitulos/:capitulo', (req, res, next) => {
    try {
        const item = encontrarLivro(req.params.livro);
        if (!item) return res.status(404).json({ erro: 'Livro não encontrado' });

        const capitulo = numero(req.params.capitulo, 'capitulo');
        const dados = item.livro.leitura[capitulo];
        if (!dados) return res.status(404).json({ erro: 'Capítulo não encontrado' });

        const inicio = req.query.inicio ? numero(req.query.inicio, 'inicio') : 1;
        const fim = req.query.fim ? numero(req.query.fim, 'fim') : dados.versi;
        if (inicio > fim || fim > dados.versi) {
            return res.status(400).json({ erro: `O intervalo deve estar entre 1 e ${dados.versi}` });
        }

        const versiculos = [];
        for (let numeroVersiculo = inicio; numeroVersiculo <= fim; numeroVersiculo += 1) {
            versiculos.push({
                numero: numeroVersiculo,
                texto: dados[numeroVersiculo]
            });
        }

        res.json({
            livro: resumo(item),
            capitulo,
            versiculos,
            texto: fun.agrupar(item.livro, capitulo, inicio, fim)
        });
    } catch (erro) {
        next(erro);
    }
});

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));
app.use((erro, req, res, next) => {
    if (res.headersSent) return next(erro);
    res.status(erro.status || 500).json({ erro: erro.status ? erro.message : 'Erro interno' });
});

if (require.main === module) {
    const porta = Number(process.env.PORT) || 3020;
    const servidor = app.listen(porta, () => console.log(`Bíblia API disponível em http://localhost:${porta}`));
    servidor.requestTimeout = 30_000;
    servidor.headersTimeout = 10_000;
    servidor.keepAliveTimeout = 5_000;
}

module.exports = app;
