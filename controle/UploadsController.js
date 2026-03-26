const { AUTORIZACAO, BASE_URL } = require("../configs.json");
const Home = require("../controle/Home.js");

class UploadsController {
	constructor(catalogoService) {
		this.catalogoService = catalogoService;
	}
	async listarProdutos(req, res) {
		const pagina = parseInt(req.query.pagina) || 1;
		const { produtos, totalPaginas, paginaAtual } = await this.catalogoService.listarProdutos(pagina);
		const urls = Home.urls();
		return res.render("catalogo.njk", {
			baseUrl: BASE_URL,
			produtos,
			totalPaginas,
			paginaAtual,
			links: [urls[0], urls[1]],
			links2: [urls[3]]
		});
	}

	async detalhesProduto(req, res) {
		const codigo = req.params.codigo;
		const produto = await this.catalogoService.detalhesProduto(codigo);
		const urls = Home.urls();

		if (!produto) {
			return res.redirect(`${BASE_URL}/produtos`);
		}

		return res.render("produto.njk", {
			baseUrl: BASE_URL,
			produto,
			links: [urls[0], urls[1]],
			links2: [urls[3]]
		});
	}

	async uploadsImagens(req, res) {
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
}


module.exports = UploadsController;
