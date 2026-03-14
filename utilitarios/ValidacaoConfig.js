const path = require("path");
const fs = require("fs");

// Campos obrigatórios do configs.json agrupados por seção
const CAMPOS_OBRIGATORIOS = [
    { secao: "NERUS_AWS",       campo: "host",     label: "Nerus AWS — Host" },
    { secao: "NERUS_AWS",       campo: "database", label: "Nerus AWS — Database" },
    { secao: "NERUS_AWS",       campo: "user",     label: "Nerus AWS — Usuário" },
    { secao: "NERUS_AWS",       campo: "port",     label: "Nerus AWS — Porta" },
    { secao: "NERUS_AWS",       campo: "password", label: "Nerus AWS — Senha" },
    { secao: "REAL_BINGO",      campo: "host",     label: "Banco Local — Host" },
    { secao: "REAL_BINGO",      campo: "user",     label: "Banco Local — Usuário" },
    { secao: "REAL_BINGO",      campo: "database", label: "Banco Local — Database" },
    { secao: "REAL_BINGO",      campo: "port",     label: "Banco Local — Porta" },
    { secao: "REAL_BINGO",      campo: "password", label: "Banco Local — Senha" },
    { secao: "HOST_IMPRESSORA", campo: "ip",       label: "Impressora — IP" },
    { secao: "HOST_IMPRESSORA", campo: "timeout", label: "Impressora — Timeout" },
    { secao: "CUPONS", campo: "valor_minimo", label: "Cupons - valor_minimo"}
];

const CONFIG_PATH = path.resolve(__dirname, "../configs.json");

class ValidacaoConfig {

    /**
     * Lê o configs.json diretamente do disco (sem cache do require)
     * para sempre refletir o estado mais recente após uma edição.
     */
    static lerConfig() {
        const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
        return JSON.parse(raw);
    }

    /**
     * Valida todos os campos obrigatórios.
     * @returns {{ valido: boolean, camposFaltando: Array<{secao, campo, label}> }}
     */
    static validar() {
        const config = ValidacaoConfig.lerConfig();
        const camposFaltando = [];

        for (const item of CAMPOS_OBRIGATORIOS) {
            const secao = config[item.secao];
            const valor = secao ? secao[item.campo] : undefined;
            const vazio = valor === undefined || valor === null || valor === "";
            if (vazio) {
                camposFaltando.push(item);
            }
        }

        return {
            valido: camposFaltando.length === 0,
            camposFaltando
        };
    }
}

module.exports = ValidacaoConfig;
