const { AUTORIZACAO, BASE_URL } = require("../configs.json");
const NavBar = require("../utilitarios/NavBar.js");

class CatalogoCardsController {
	constructor(catalogoService) {
		this.catalogoService = catalogoService;
	}

	async listarProdutos(req, res) {
		const pagina = parseInt(req.query.pagina) || 1;
		const busca = req.query.busca ? req.query.busca : null;

		const { produtos, totalPaginas, paginaAtual } = await this.catalogoService.listarProdutosAdmin(pagina, busca);

		const modulos = NavBar.getModulos();

		return res.render("Catalogo/catalogoCards.njk", {
			baseUrl: BASE_URL,
			produtos,
			totalPaginas,
			paginaAtual,
			modulos,
			BASE_URL,
			usuario: req.session.usuario
		});
	}
}

module.exports = CatalogoCardsController;
