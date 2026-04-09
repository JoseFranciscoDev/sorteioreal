const { BASE_URL } = require("../configs.json");

function estaLogado(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect(BASE_URL + "/");
    }
    next();
}

module.exports = estaLogado;