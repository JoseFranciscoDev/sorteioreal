const ValidacaoConfig = require("../utilitarios/ValidacaoConfig.js");
const { BASE_URL } = require("../configs.json");

/**
 * Middleware que bloqueia o acesso a qualquer rota protegida
 * quando existem campos obrigatórios faltando no configs.json.
 *
 * Rotas sempre livres: login (/) e /home/configuracoes
 */
function verificaConfig(req, res, next) {
    const { valido } = ValidacaoConfig.validar();

    if (valido) {
        return next();
    }

    // Config incompleta: redireciona para a tela de configurações
    return res.redirect(`${BASE_URL}/home/configuracoes`);
}

module.exports = verificaConfig;
