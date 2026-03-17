const fs = require("fs");
const path = require("path");
const {v4: uuidv4} = require("uuid");


class CatalogoService {
    
    constructor(produtoImagemDao) {
        
        this.produtoImagemDao = produtoImagemDao;
    }
    
    
    async uploadImagens(codigoProduto, usuario, arquivos) {
        
        const pastaProduto = path.resolve("public/catalogo", codigoProduto.toString());
        
        fs.mkdirSync(pastaProduto, {recursive: true});
        
        for (const arquivo of arquivos) {
            
            const extensao = path.extname(arquivo.originalname);
            
            const nomeImagem = uuidv4() + extensao;
            
            const caminhoOrigem = arquivo.path;
            
            const caminhoDestino = path.resolve(pastaProduto, nomeImagem);
            
            fs.renameSync(caminhoOrigem, caminhoDestino);
            
            const urlImagem = `/catalogo/${nomeImagem}`;
            
            await this.produtoImagemDao.salvarImagem({
                codigo_produto: codigoProduto,
                imagem_nome: nomeImagem,
                imagem_url: urlImagem,
                codigo_usuario: usuario.id
            });
        }
    }
}


module.exports = CatalogoService;