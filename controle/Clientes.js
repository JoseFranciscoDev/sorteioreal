const ClienteDao = require("../modelo/ClienteDao.js");
const { BASE_URL } = require("../configs.json");
const NavBar = require("../utilitarios/NavBar.js");

class Clientes {
    static async listarCadastrados(req, res) {
        const erro = req.query.erro;
        const clientes = await ClienteDao.getClientes();
        const modulos = NavBar.getModulos();
        res.render("clientes.njk", { clientes, BASE_URL, erro, modulos });
    }
    static async listarClientesCupons(req, res) {
        const erro = req.query.erro;
        const clientes = await ClienteDao.getClientes();
        const modulos = NavBar.getModulos();
        res.render("clientesCupons.njk", { clientes, BASE_URL, erro, modulos });
    }
}

module.exports = Clientes;