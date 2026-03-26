const { AUTORIZACAO, BASE_URL } = require("../configs.json");
const Home = require("../controle/Home.js");

class UploadsController {
	constructor(catalogoService) {
		this.catalogoService = catalogoService;
	}
	async listarProdutos(req, res) {
		const usuario = req.session.usuario;
		const produtos = await this.catalogoService.listarProdutos();
		if (!usuario) {
			return res.redirect(BASE_URL);
		}
		if (usuario && usuario.tipo == AUTORIZACAO.normal) {
			return res.redirect(BASE_URL);
		}
		const urls = Home.urls();
		return res.render("catalogo.njk", { produtos, links: [urls[0], urls[1]], links2: [urls[3]] });
	}

	async uploadsImagens(req, res) {
		const message = req.query.message;
		const usuario = req.session.usuario;


		if (!usuario) {

			return res.redirect("/login");
		}

		if (usuario && usuario.tipo == AUTORIZACAO.normal) {

			return res.redirect("/login");

		}
		const urls = Home.urls();
		return res.render("upload.njk", { baseUrl: BASE_URL + "/uploads", message, links: [urls[0], urls[2]], links2: [urls[3]] });
	}


	async uploads(req, res) {
		try {
			const codigoProduto = req.body.codigo_produto;
			const usuario = req.session.usuario;
			const arquivos = req.files;
			console.log(arquivos)


			if (!usuario) return res.redirect("/login");

			if (usuario && usuario.tipo == AUTORIZACAO.normal) {

				return res.redirect("/login");
			}


			if (!codigoProduto) {
				return res.render("upload.njk", { erro: "Codigo do produto é obrigatorio" });
			}


			if (!arquivos || arquivos.length == 0) {
				return res.render("upload.njk", { erro: "Nenhuma imagem enviada" });
			}


			await this.catalogoService.uploadImagens(codigoProduto, usuario, arquivos);


			return res.redirect(`${BASE_URL}/uploads?message=Imagens enviadas com sucesso`);
		} catch (erro) {

			console.error(erro);

			return res.render("upload.njk", { erro: "Erro ao enviar imagens" });
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
