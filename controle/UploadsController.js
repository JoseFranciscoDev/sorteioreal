const { AUTORIZACAO, BASE_URL } = require("../configs.json");
const NavBar = require("../utilitarios/NavBar.js");


class UploadsController {
	constructor(catalogoService) {
		this.catalogoService = catalogoService;
	}
	async listarProdutos(req, res) {
		const pagina = parseInt(req.query.pagina) || 1;
		const busca = req.query.busca ? req.query.busca : null;
		const { produtos, totalPaginas, paginaAtual } = await this.catalogoService.listarProdutosAdmin(pagina, busca);
		const modulos = NavBar.getModulos();
		return res.render("Catalogo/catalogo.njk", {
			baseUrl: BASE_URL,
			produtos,
			totalPaginas,
			paginaAtual,
			modulos,
			BASE_URL,
			usuario: req.session.usuario
		});
	}

	async detalhesProduto(req, res) {
		const codigo = req.params.codigo;
		const produto = await this.catalogoService.detalhesProduto(codigo);
		const modulos = NavBar.getModulos();

		if (!produto) {
			return res.redirect(`${BASE_URL}/produtos`);
		}


		return res.render("produto.njk", {
			baseUrl: BASE_URL,
			produto,
			modulos,
			BASE_URL
		});
	}

	async uploadsImagens(req, res) {
		const message = ""

		const modulos = NavBar.getModulos();
		return res.render("upload.njk", { baseUrl: BASE_URL + "/uploads", message, modulos, BASE_URL });
	}


	async uploads(req, res) {
		try {
			const codigoProduto = req.body.codigo_produto;
			const usuario = req.session.usuario;
			const arquivos = req.files;


			if (!codigoProduto) {
				return res.status(400).json({ erro: "Codigo do produto é obrigatorio" });
			}


			if (!arquivos || arquivos.length == 0) {
				return res.status(400).json({ erro: "Nenhuma imagem enviada" });
			}


			await this.catalogoService.uploadImagens(codigoProduto, usuario, arquivos);


			return res.status(200).json({ sucesso: "Imagens enviadas com sucesso!" });
		} catch (erro) {

			console.error(erro);

			return res.status(500).json({ erro: "Erro ao enviar imagens" });
		}

	}


	async removeImagens(req, res) {

		try {
			const usuario = req.session.usuario;
			const id = req.params.id;

			if (!usuario) {

				res.redirect("/login");
			}


			if (usuario && usuario.tipo == AUTORIZACAO.normal) {

				return res.redirect("/login");

			}

			const resultado = await this.catalogoService.removeProdutoImagemId(id);

			if (!resultado) {

				res.send("Imagem não encontrada!");
			}


			res.send("Imagem removida com sucesso!");



		} catch (erro) {

			res.send(erro.message);
		}




	}


	async uploadsImagensUpdate(req, res) {
		try {
			const id = req.params.id;
			const usuario = req.session.usuario;
			const codigoProduto = req.body.codigo_produto;
			const arquivos = req.files;



			if (!usuario) {

				return res.redirect("/login");
			}


			if (usuario && usuario.tipo == AUTORIZACAO.normal) {

				return res.redirect("/login");

			}


			if (!codigoProduto) {
				return res.send("Codigo do produto é obrigatorio");
			}


			if (!arquivos || arquivos.length == 0) {
				return res.send("Nenhuma imagem enviada");
			}


			const resultado = await this.catalogoService.updateImagens(id, codigoProduto, usuario, arquivos);

			if (resultado && (resultado.sucesso == true)) {

				res.send("Imagem atualizada com sucesso!");
			}

		} catch (erro) {

			res.send(erro.message);
		}

	}
}


module.exports = UploadsController;
