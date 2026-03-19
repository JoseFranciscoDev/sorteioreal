const fs = require("fs");
const path = require("path");
const {v4: uuidv4} = require("uuid");


class CatalogoService {
    
    constructor(uploadsDao) {
        
        this.uploadsDao = uploadsDao;
    }
    
    
    async uploadImagens(codigoProduto, usuario, arquivos) {
        
        const pastaProduto = path.resolve("public/catalogo", codigoProduto.toString());
        
        fs.mkdirSync(pastaProduto, {recursive: true});
	
	console.log(codigoProduto);
	console.log(usuario);
	console.log(arquivos);

        for (const arquivo of arquivos) {
            
            const extensao = path.extname(arquivo.originalname);
            
            const nomeImagem = uuidv4() + extensao;
            
            const caminhoOrigem = arquivo.path;
            
            const caminhoDestino = path.resolve(pastaProduto, nomeImagem);
            
            fs.renameSync(caminhoOrigem, caminhoDestino);
            
            const urlImagem = `/catalogo/${nomeImagem}`;
            
           console.log(usuario);
            
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
