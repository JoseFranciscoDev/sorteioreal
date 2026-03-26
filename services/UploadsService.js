const fs = require("fs");
const path = require("path");
const {v4: uuidv4} = require("uuid");



class CatalogoService {
    
    constructor(uploadsDao) {
        
        this.uploadsDao = uploadsDao;
    }
    
    
    async listarProdutos() {
        
        const loja = 1;
        
        
        const produtos = await this.uploadsDao.buscarImagensProdutos();
        
        if (!produtos || produtos.length === 0) {
            
            return [];
        } 
        
        
        
        const codigos = produtos.map(p => p.codigo_produto);
        
        const dadosProdutos = await this.uploadsDao.buscarDadosProdutos(codigos, loja);
        
        
        
        const  mapaProdutos = new Map();
        
        
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
        
        
        console.log(listaFinal);
        
       
        } 
        
    
    
    async uploadImagens(codigoProduto, usuario, arquivos) {
        
        const pastaProduto = path.resolve("public/catalogo", codigoProduto.toString());
        

        if (!fs.existsSync(pastaProduto)) {
            fs.mkdirSync(pastaProduto, {recursive: true});
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
        } catch(erro) {
            
            console.log("Erro ao tentar remover a imagem: ", erro);
            throw erro;
        }               
       
        
    }
}


module.exports = CatalogoService;
