// Estrutura do objeto
module.exports = {
    newLivro (i, n, a, c, l) {
        return { id: i, nome: n, abr: a, capitulos: c, leitura: l };
    },
    
    agrupar (livro, cap, numI, numF) {
        const leitura = livro.leitura[cap];
        if (!leitura) return "";

        const inicio = Math.max(1, Number(numI) || 1);
        const fim = Math.min(leitura.versi, Math.max(inicio, Number(numF) || inicio));
        const escolhido = [];
        for (let i = inicio; i <= fim; i += 1) escolhido.push(leitura[i]);
        return escolhido.join(" ");
    }
};
