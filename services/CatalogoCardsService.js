const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");



class CatalogoService {

    constructor(uploadsDao) {

        this.uploadsDao = uploadsDao;
    }


    async listarProdutos(pagina = 1, busca = null, loja = 1) {
        const limit = 10;
        const offset = (pagina - 1) * limit;

        const total = await this.uploadsDao.contarTotalImagens();
        const totalPaginas = Math.ceil(total / limit);

        const produtos = await this.uploadsDao.buscarImagensProdutos(limit, offset, busca);

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
            const temImagens = !!produto.imagem_url;
            return {
                codigo: produto.codigo_produto,
                nome: dados?.produto || null,
                preco: dados?.preco || null,
                temImagens,
                imagens: temImagens ? [{ imagem_url: produto.imagem_url }] : []
            };
        });
        console.log({ produtos: listaFinal[1].imagens[0].imagem_url })
        return { produtos: listaFinal, totalPaginas, paginaAtual: pagina };
    }

    async detalhesProduto(codigo_produto, loja) {
        const imagens = await this.uploadsDao.buscarImagensPorCodigo(codigo_produto);
        console.log("Loja", loja)

        if (!imagens || imagens.length === 0) {
            return null;
        }
        const dadosProdutos = await this.uploadsDao.buscarDadosProdutos(parseInt(codigo_produto), loja);
        const dados = dadosProdutos[0] || null;
        return {
            codigo_produto,
            nome_produto: dados?.produto || null,
            descricaoCompleta: dados?.descricaoCompleta || null,
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

    async removeProdutoImagemId(id) {

        const [produto] = await this.uploadsDao.buscarProdutoImagemId(id);


        if (!produto) {
            return false;
        }

        const imagemPath = path.resolve("public", produto.imagem_url);


        try {

            if (fs.existsSync(imagemPath)) {
                fs.unlinkSync(imagemPath);
                console.log("arquivo removido: ", imagemPath);
            }

            const resultado = await this.uploadsDao.removeProdutoImagemId(produto.id);

            return resultado.affectedRows != 0;
        } catch (erro) {

            console.log("Erro ao tentar remover a imagem: ", erro);
            throw erro;
        }


    }

    async updateImagens(id, codigoProduto, usuario, arquivos) {
        try {

            const pastaProduto = path.resolve("public/catalogo", codigoProduto.toString());

            const [imagem] = await this.uploadsDao.buscarImagensId(id);

            if (!imagem || !imagem.imagem_url) {

                throw new Error("Imamgem não encontrada our url invalida");
            }

            const imagemPath = path.resolve("public", imagem.imagem_url);

            if ((imagem.id == id) && (imagem.codigo_produto == codigoProduto)) {

                if (fs.existsSync(imagemPath)) {
                    fs.unlinkSync(imagemPath);

                }

                if (!fs.existsSync(pastaProduto)) {
                    fs.mkdirSync(pastaProduto, { recursive: true });
                }


                for (const arquivo of arquivos) {
                    const nomeImagem = arquivo.filename;
                    const caminhoOrigem = arquivo.path;

                    if (!nomeImagem || !caminhoOrigem) {
                        throw new Error("Arquivo invalido no upload");
                    }

                    const caminhoDestino = path.resolve(pastaProduto, nomeImagem);

                    fs.renameSync(caminhoOrigem, caminhoDestino);

                    const urlImagem = `catalogo/${codigoProduto.toString()}/${nomeImagem}`;


                    await this.uploadsDao.updateImagensProduto(id, codigoProduto, nomeImagem, urlImagem, usuario);


                }


                return { sucesso: true };

            }

        } catch (erro) {
            console.log(erro);
            return erro;
        }





    }
}


module.exports = CatalogoService;
