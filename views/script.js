// Exemplo de retorno em site na porta 3020
const fun = require('../class');
const antigo = require('../textosAntigo');
const novo = require('../textosNovo');

// SITE EXEMPLO
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.set('view engine', 'hbs');

app.listen(3020, (req, res) => {
    console.log("Servidor ligado")
})

app.get('/', (req, res) => {
    res.render('./index', {
        txts_old: antigo.livros,
        selected: 1,
        txts_new: novo.livros
    })
});

const hbs = require('hbs');

hbs.registerHelper('checkSelected', function (id, target) {
    return id === target
});

hbs.registerHelper('json', function (content) {
    return JSON.stringify(content);
});

let mensagem;
app.post('/resultado', (req, res) => {
    const { livro, capitulo, verI, verF } = req.body; // Recebe os valores do formulário

    //ANTIGO 
    for (a = 0; a < antigo.livros.length; a++) {
        if (antigo.livros[a].nome == livro) { // Para saber o livro

            for (b = 1; b <= antigo.livros[a].capitulos; b++) {
                if (b == capitulo) { // Para saber o capítulo

                    for (c = 1; c <= antigo.livros[a].leitura[b]["versi"]; c++) {
                        if (c == verI) { // Para saber o versículo inicial

                            for (d = 1; d <= antigo.livros[a].leitura[b]["versi"]; d++) {
                                if (d == verF) { // Para saber o versículo final
                                    mensagem = fun.agrupar(antigo.livros[a], b, c, d);
    }}}}}}}}

    // NOVO 
    for (a = 0; a < novo.livros.length; a++) {
        if (novo.livros[a].nome == livro) { // Para saber o livro

            for (b = 1; b <= novo.livros[a].capitulos; b++) {
                if (b == capitulo) { // Para saber o capítulo

                    for (c = 1; c <= novo.livros[a].leitura[b]["versi"]; c++) {
                        if (c == verI) { // Para saber o versículo inicial

                            for (d = 1; d <= novo.livros[a].leitura[b]["versi"]; d++) {
                                if (d == verF) { // Para saber o versículo final
                                    mensagem = fun.agrupar(novo.livros[a], b, c, d);
    }}}}}}}}

    res.render('./index', {
        txts_old: antigo.livros,
        selected: 1,
        txts_new: novo.livros,
        message: mensagem
    })
});