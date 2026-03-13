const path = require("path");
const fs = require("fs");
const ValidacaoConfig = require("../utilitarios/ValidacaoConfig.js");
const { BASE_URL } = require("../configs.json");

const CONFIG_PATH = path.resolve(__dirname, "../configs.json");

class Configuracoes {

    static index(req, res) {
        // Lê config direto do disco para ter dados atualizados
        const config = ValidacaoConfig.lerConfig();
        const { valido, camposFaltando } = ValidacaoConfig.validar();
        
        res.render("configuracoes.njk", {
            config,
            valido,
            camposFaltando,
            mensagem: req.query.mensagem || "",
            erro: req.query.erro || "",
            BASE_URL
        });
    }

    static salvar(req, res) {
        try {
            const config = ValidacaoConfig.lerConfig();

            // Atualiza apenas os campos enviados pelo form
            config.NERUS_AWS.host     = req.body.nerus_host     || "";
            config.NERUS_AWS.database = req.body.nerus_database  || "";
            config.NERUS_AWS.user     = req.body.nerus_user      || "";
            config.NERUS_AWS.port     = parseInt(req.body.nerus_port) || 0;
            config.NERUS_AWS.password = req.body.nerus_password  || "";

            config.REAL_BINGO.host     = req.body.bingo_host     || "";
            config.REAL_BINGO.user     = req.body.bingo_user     || "";
            config.REAL_BINGO.database = req.body.bingo_database || "";
            config.REAL_BINGO.port     = parseInt(req.body.bingo_port) || 0;
            config.REAL_BINGO.password = req.body.bingo_password || "";

            config.HOST_IMPRESSORA.ip      = req.body.impressora_ip      || "";
            config.HOST_IMPRESSORA.timeout = parseInt(req.body.impressora_timeout) || 0;
            config.CUPONS.valor_minimo = req.body.valor_minimo || "";


            // Salva no disco com indentação legível
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");

            res.redirect(`${BASE_URL}/home/configuracoes?mensagem=Configurações salvas com sucesso!`);
        } catch (erro) {
            res.redirect(`${BASE_URL}/home/configuracoes?erro=${encodeURIComponent(erro.message)}`);
        }
    }
}

module.exports = Configuracoes;
