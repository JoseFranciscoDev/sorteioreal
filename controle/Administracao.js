const { BASE_URL } = require("../configs.json");
const UsuariosDao = require("../modelo/UsuariosDao.js");
const NavBar = require("../utilitarios/NavBar.js");

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
}

module.exports = Administracao;
