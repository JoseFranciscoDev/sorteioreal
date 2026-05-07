const { BASE_URL } = require("../configs.json");
const UsuariosDao = require("../modelo/UsuariosDao.js");
const NavBar = require("../utilitarios/NavBar.js");
const AdministracaoService = require("../services/AdministracaoService.js")
class Administracao {
    static async index(req, res) {
        try {
            const modulos = NavBar.getModulos();
            res.render("administracao.njk", {
                modulos,
                url: `${BASE_URL}/`,
                BASE_URL
            });
        } catch (erro) {
            res.status(500).send("Erro ao carregar o painel de administração.");
        }
    }

    static async listarUsuarios(req, res) {
        try {
            const usuarios = await UsuariosDao.getUsuarios();
            const modulos = NavBar.getModulos();

            res.render("usuarios.njk", {
                usuarios,
                modulos,
                url: `${BASE_URL}/`,
                BASE_URL
            });
        } catch (erro) {
            res.status(500).send("Erro ao carregar a lista de usuários.");
        }
    }

    static async listarPedidos(req, res) {
        try {
            const { pagina = 1, porPagina = 10 } = req.query;
            const paginaInt = parseInt(pagina);
            const porPaginaInt = parseInt(porPagina);
            const modulos = NavBar.getModulos();
            const { pedidos, ultimaPagina } = await AdministracaoService.getPedidos(paginaInt, porPaginaInt);

            res.render("pedidos.njk", {
                pedidos,
                ultimaPagina,
                modulos,
                paginaInt,
                porPaginaInt,
                BASE_URL
            });
        } catch (erro) {
            res.status(500).send("Erro ao carregar a lista de pedidos." + erro);
        }
    }
}

module.exports = Administracao;
