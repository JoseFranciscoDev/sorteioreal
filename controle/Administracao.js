const { BASE_URL } = require("../configs.json");
const UsuariosDao = require("../modelo/UsuariosDao.js");
const NavBar = require("../utilitarios/NavBar.js");
const CupomDao = require("../modelo/CupomDao.js");
const CuponsClientesDao = require("../modelo/CuponsClientesDao.js")
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
            const pedidos = await CupomDao.getPedidos()
            const modulos = NavBar.getModulos();
            const codigosPedidos = pedidos.map(pedido => pedido.pedido)
            const verificarCuponsImpressos = await CuponsClientesDao.verificarCuponsImpressos(codigosPedidos)

            // Indexa pelo codigoPedido para evitar mapeamento errado por posição
            const cuponsMap = new Map(verificarCuponsImpressos.map(r => [r.codigoPedido, r]))
            for (const pedido of pedidos) {
                const info = cuponsMap.get(pedido.pedido)
                pedido.todoCuponsImpressos = info ? Boolean(info.todosCuponImpressos) : false
                pedido.quantidadeImpressa = info.quantidadeImpressa
            }

            res.render("pedidos.njk", {
                pedidos,
                modulos,
                BASE_URL
            });
        } catch (erro) {
            res.status(500).send("Erro ao carregar a lista de pedidos." + erro);
        }
    }
}

module.exports = Administracao;
