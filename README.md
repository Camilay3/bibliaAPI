# Descrição
Bíblia completa (73 livros) em português.

## Instalação
```bash
  # Clonar o repositório 
  $ git clone https://github.com/Camilay3/bibliaAPI
```
```bash
  # Navegar até a pasta
  $ cd bibliaAPI
```
```bash
  # Instalar dependências 
  npm install
```
```bash
  # Iniciar a api
  npm start
```

## Acesso ao exemplo
Após iniciar, é possível acessar a página de exemplo:<br>
→ <a target="_blank" href="http://localhost::3020">http://localhost::3020</a>

## Uso
Template
```javascript
  // Para exibir valor diretamente
  console.log(fun.agrupar(testamento.livro, capítulo, versículo inicial, versículo final))
  
  // Para exibir valor utilizando listas
  console.log(fun.agrupar(testamento.livros[índice do livro], capítulo, versículo inicial, versículo final))
  
  // Para exibir o capítulo inteiro
  console.log(fun.agrupar(testamento.livro, capítulo, 1, testamento.livro.leitura[capítulo]["versi"]));
```

Exemplo 
```javascript
  // Diretamente (Gn 1:1-3)
  console.log(fun.agrupar(antigo.genesis, 1, 1, 3))
  
  // Utilizando listas (Gn 1)
  console.log(fun.agrupar(antigo.livros[0], 1, 1, antigo.livros[0].leitura[capítulo]["versi"]))
```

Para encerrar o processo, utilize Ctrl+C
```bash
  Deseja finalizar o arquivo em lotes (S/N)? s
```

## Créditos
→ Documentar o código (responsáveis: [Camila Azevedo](https://github.com/Camilay3) e [Leandro Fé](https://github.com/LeandroLFE))<br>
→ Documentar os textos (responsáveis: [Camila Azevedo](https://github.com/Camilay3), [João Gabriel](https://github.com/JGabrielJ), [Viviane Rodrigues](https://github.com/vivirnogueira), [Maxwel Gomes](https://github.com/maxw-santos), [Daniel Anastácio](https://github.com/Daniel-Anastacio) e [Maria Letícia](https://github.com/leticiadutra22-23))
