const { AUTORIZACAO, BASE_URL } = require("../configs.json");
const NavBar = require("../utilitarios/NavBar");

function vericaEAdmin(req, res, next) {
    if (!req.session.usuario || !req.session.usuario.tipo) {
        const modulos = NavBar.getModulos()
        return res.render("home.html", { "mensagem": "Você não tem permissão para acessar esta página", "modulos": modulos, BASE_URL });
    }
    if (req.session.usuario.tipo != AUTORIZACAO.admin) {
        const modulos = NavBar.getModulos()
        return res.render("home.html", { "mensagem": "Você não tem permissão para acessar esta página", "modulos": modulos, BASE_URL });
    }
    next();
}

module.exports = vericaEAdmin;