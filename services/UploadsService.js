const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");



class CatalogoService {

    constructor(uploadsDao) {

        this.uploadsDao = uploadsDao;
    }


    async listarProdutos(pagina = 1) {
        const loja = 1;
        const limit = 10;
        const offset = (pagina - 1) * limit;

        const total = await this.uploadsDao.contarTotalImagens();
        const totalPaginas = Math.ceil(total / limit);

        const produtos = await this.uploadsDao.buscarImagensProdutos(limit, offset);

        if (!produtos || produtos.length === 0) {
            return { produtos: [], totalPaginas, paginaAtual: pagina };
        }

        const codigos = produtos.map(p => p.codigo_produto);
        const dadosProdutos = await this.uploadsDao.buscarDadosProdutos(codigos, loja);

        const mapaProdutos = new Map();
        for (const item of dadosProdutos) {
            mapaProdutos.set(item.codigo, item);
        }

        const listaFinal = produtos.map(produto => {
            const dados = mapaProdutos.get(produto.codigo_produto);
            return {
                ...produto,
                nome_produto: dados?.produto || null,
                preco: dados?.preco || null
            };
        });

        return { produtos: listaFinal, totalPaginas, paginaAtual: pagina };
    }

    async detalhesProduto(codigo_produto) {
        const loja = 1;

        const imagens = await this.uploadsDao.buscarImagensPorCodigo(codigo_produto);

        if (!imagens || imagens.length === 0) {
            return null;
        }

        const dadosProdutos = await this.uploadsDao.buscarDadosProdutos([codigo_produto], loja);
        const dados = dadosProdutos[0] || null;

        return {
            codigo_produto,
            nome_produto: dados?.produto || null,
            preco: dados?.preco || null,
            imagens
        };
    }



    async uploadImagens(codigoProduto, usuario, arquivos) {

        const pastaProduto = path.resolve("public/catalogo", codigoProduto.toString());


        if (!fs.existsSync(pastaProduto)) {
            fs.mkdirSync(pastaProduto, { recursive: true });
        }

        for (const arquivo of arquivos) {


            const nomeImagem = arquivo.filename;
            const caminhoOrigem = arquivo.path;

            const caminhoDestino = path.resolve(pastaProduto, nomeImagem);

            fs.renameSync(caminhoOrigem, caminhoDestino);

            const urlImagem = `catalogo/${codigoProduto.toString()}/${nomeImagem}`;

            await this.uploadsDao.salvarImagem({
                codigo_produto: codigoProduto,
                imagem_nome: nomeImagem,
                imagem_url: urlImagem,
                codigo_usuario: usuario.codigo
            });
        }
    }
}


module.exports = CatalogoService;
