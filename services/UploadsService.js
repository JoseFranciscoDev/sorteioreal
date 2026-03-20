const fs = require("fs");
const path = require("path");
const {v4: uuidv4} = require("uuid");


class CatalogoService {
    
    constructor(uploadsDao) {
        
        this.uploadsDao = uploadsDao;
    }
    
    
    async uploadImagens(codigoProduto, usuario, arquivos) {
        
        const pastaProduto = path.resolve("public/catalogo", codigoProduto.toString());
        
<<<<<<< HEAD
        fs.mkdirSync(pastaProduto, {recursive: true});
	
	console.log(codigoProduto);
	console.log(usuario);
	console.log(arquivos);
=======
        if (!fs.existsSync(pastaProduto)) {
            fs.mkdirSync(pastaProduto, {recursive: true});
        }
>>>>>>> dev

        for (const arquivo of arquivos) {
            
         /*   const extensao = path.extname(arquivo.originalname);
            console.log(extensao);*/
            
            const nomeImagem = arquivo.filename;
            
            const caminhoOrigem = arquivo.path;
            
            const caminhoDestino = path.resolve(pastaProduto, nomeImagem);
            console.log(caminhoDestino);
            
            fs.renameSync(caminhoOrigem, caminhoDestino);
            
            const urlImagem = `/public/catalogo/${codigoProduto.toString()}/${nomeImagem}`;
            
<<<<<<< HEAD
           console.log(usuario);
=======
       
>>>>>>> dev
            
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
