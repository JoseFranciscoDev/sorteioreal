const { BASE_URL } = require("../configs.json");
const UsuariosDao = require("../modelo/UsuariosDao.js");

class Administracao {
    static async index(req, res) {
        try {
            const { links, links2 } = require("./Home.js").urlsAdm();
            res.render("administracao.njk", { 
                links, 
                links2, 
                url: `${BASE_URL}/` 
            });
        } catch (erro) {
            res.status(500).send("Erro ao carregar o painel de administração.");
        }
    }

    static async listarUsuarios(req, res) {
        try {
            const usuarios = await UsuariosDao.getUsuarios();
            const { links, links2 } = require("./Home.js").urlsAdm();
            
            res.render("usuarios.njk", { 
                usuarios, 
                links, 
                links2, 
                url: `${BASE_URL}/` 
            });
        } catch (erro) {
            res.status(500).send("Erro ao carregar a lista de usuários.");
        }
    }
}

module.exports = Administracao;
