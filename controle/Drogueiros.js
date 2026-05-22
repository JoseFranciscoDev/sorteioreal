const { DrogueirosDao, PRODUTOS_POR_PAGINA } = require("../modelo/DrogueirosDao.js");
const { BASE_URL } = require("../configs.json");
const NavBar = require("../utilitarios/NavBar.js");

class Drogueiros {
    static async listarProdutos(req, res) {
        const paginaAtual = Math.max(1, parseInt(req.query.pagina) || 1);
        const offset = (paginaAtual - 1) * PRODUTOS_POR_PAGINA;

        const produtos = await DrogueirosDao.getProdutos(PRODUTOS_POR_PAGINA, offset);
        const modulos = NavBar.getModulos();

        const temProximaPagina = produtos.length === PRODUTOS_POR_PAGINA;

        res.render("Compras/drogueiros.njk", {
            produtos,
            BASE_URL,
            modulos,
            paginaAtual,
            temProximaPagina
        });
    }
}

module.exports = Drogueiros;
