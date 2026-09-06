module.exports = {
    openapi: '3.0.3',
    info: {
        title: 'Bíblia API',
        version: '2.0.0',
        description: 'API dos 73 livros da Bíblia em português.'
    },
    servers: [{ url: 'http://localhost:3020' }],
    paths: {
        '/': {
            get: {
                summary: 'Informações da API',
                responses: { 200: { description: 'Metadados e rotas disponíveis.' } }
            }
        },
        '/api/livros': {
            get: {
                summary: 'Lista os livros',
                parameters: [{
                    name: 'testamento',
                    in: 'query',
                    schema: { type: 'string', enum: ['antigo', 'novo'] }
                }],
                responses: {
                    200: {
                        description: 'Livros encontrados.',
                        content: { 'application/json': {
                            schema: { type: 'array', items: { $ref: '#/components/schemas/Livro' } }
                        } }
                    },
                    400: { $ref: '#/components/responses/Erro' }
                }
            }
        },
        '/api/livros/{livro}': {
            get: {
                summary: 'Consulta um livro',
                parameters: [{ $ref: '#/components/parameters/Livro' }],
                responses: {
                    200: {
                        description: 'Livro e quantidade de versículos por capítulo.',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/LivroDetalhe' } } }
                    },
                    404: { $ref: '#/components/responses/Erro' }
                }
            }
        },
        '/api/livros/{livro}/capitulos/{capitulo}': {
            get: {
                summary: 'Consulta um capítulo ou intervalo de versículos',
                parameters: [
                    { $ref: '#/components/parameters/Livro' },
                    { $ref: '#/components/parameters/Capitulo' },
                    { $ref: '#/components/parameters/Inicio' },
                    { $ref: '#/components/parameters/Fim' }
                ],
                responses: {
                    200: {
                        description: 'Versículos consultados.',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Capitulo' } } }
                    },
                    400: { $ref: '#/components/responses/Erro' },
                    404: { $ref: '#/components/responses/Erro' }
                }
            }
        }
    },
    components: {
        parameters: {
            Livro: {
                name: 'livro', in: 'path', required: true,
                description: 'Nome, abreviação ou ID do livro.',
                schema: { type: 'string', example: 'Joao' }
            },
            Capitulo: {
                name: 'capitulo', in: 'path', required: true,
                schema: { type: 'integer', minimum: 1, example: 3 }
            },
            Inicio: {
                name: 'inicio', in: 'query',
                schema: { type: 'integer', minimum: 1, example: 1 }
            },
            Fim: {
                name: 'fim', in: 'query',
                schema: { type: 'integer', minimum: 1, example: 5 }
            }
        },
        responses: {
            Erro: {
                description: 'Erro da requisição.',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } }
            }
        },
        schemas: {
            Livro: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 43 },
                    nome: { type: 'string', example: 'João' },
                    abreviacao: { type: 'string', example: 'Jo' },
                    capitulos: { type: 'integer', example: 21 },
                    testamento: { type: 'string', enum: ['antigo', 'novo'] }
                }
            },
            LivroDetalhe: {
                type: 'object',
                properties: {
                    livro: { $ref: '#/components/schemas/Livro' },
                    capitulos: { type: 'array', items: {
                        type: 'object',
                        properties: {
                            numero: { type: 'integer', example: 3 },
                            versiculos: { type: 'integer', example: 36 }
                        }
                    } }
                }
            },
            Capitulo: {
                type: 'object',
                properties: {
                    livro: { $ref: '#/components/schemas/Livro' },
                    capitulo: { type: 'integer', example: 3 },
                    versiculos: { type: 'array', items: {
                        type: 'object',
                        properties: {
                            numero: { type: 'integer', example: 1 },
                            texto: { type: 'string' }
                        }
                    } },
                    texto: { type: 'string' }
                }
            },
            Erro: {
                type: 'object',
                properties: { erro: { type: 'string', example: 'Livro não encontrado' } }
            }
        }
    }
};
