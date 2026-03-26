const {AUTORIZACAO, BASE_URL} = require("../configs.json");


class UploadsController {

	constructor(catalogoService) {
		this.catalogoService = catalogoService;
	}
        
        
        async listarProdutos(req, res) {
            
            await this.catalogoService.listarProdutos();
        }
        

	async uploadsImagens(req, res) {

		const usuario = req.session.usuario;
	
                
                if (!usuario) {
                    
                    return res.redirect("/login");
                }

		if (usuario && usuario.tipo == AUTORIZACAO.normal ) {
                    
                    return res.redirect("/login");

		}
                
                

		return res.render("upload.njk", {baseUrl: BASE_URL + "/uploads"});
	}


	async uploads(req, res) {
		try {
			const codigoProduto = req.body.codigo_produto;
			const usuario = req.session.usuario;
			const arquivos = req.files;


			if(!usuario) return res.redirect("/login");
                        
                        if (usuario && usuario.tipo == AUTORIZACAO.normal ) {
                            
                           return res.redirect("/login");
                        }


			if (!codigoProduto) {
				return res.render("upload.njk", {erro: "Codigo do produto é obrigatorio"});
			}


			if (!arquivos || arquivos.length == 0) {
				return res.render("upload.njk", {erro: "Nenhuma imagem enviada"});
			}


			await this.catalogoService.uploadImagens(codigoProduto, usuario, arquivos);


			return res.redirect("upload.njk");
		} catch(erro) {

			console.error(erro);

			return res.render("upload.njk", {erro: "Erro ao enviar imagens"});
		}

	}
        
        
        async removeImagens(req, res) {
            
            try {
                    const usuario = req.session.usuario;
                    const id = req.params.id;
                                
                    if (!usuario) {
                
                            res.redirect("/login");
                     }
            
            
                     if (usuario && usuario.tipo == AUTORIZACAO.normal ) {
                    
                            return res.redirect("/login");

                }
                
               const resultado = await this.catalogoService.removeProdutoImagemId(id);
                
                if (!resultado) {
                    
                    res.send("Imagem não encontrada!");
                }
                
                
                res.send("Imagem removida com sucesso!");
            
            
                
            } catch(erro) {
                
                res.send(erro.message);
            }
            
        
            
            
        }
}


module.exports = UploadsController;
