const Abstract = require("./Abstract.js");

class ConciliacaoDao extends Abstract {

    static async criarTabelaVeiculos() {
        const conn = await this.connection();
        const sql = `
            CREATE TABLE IF NOT EXISTS veiculos (
                codigo  INT          AUTO_INCREMENT PRIMARY KEY,
                nome    VARCHAR(100) NOT NULL UNIQUE,
                modelo  VARCHAR(80)  NOT NULL,
                cor     VARCHAR(40)  NOT NULL,
                placa   VARCHAR(8)   NOT NULL UNIQUE,
                chassi  VARCHAR(17)  NOT NULL UNIQUE
            )`;
        await conn.query(sql);
    }

    static async criarTabelaRotas() {
        const conn = await this.connection();
        const sql = `
            CREATE TABLE IF NOT EXISTS rotas (
                codigo        INT          AUTO_INCREMENT PRIMARY KEY,
                nome          VARCHAR(60)  NOT NULL UNIQUE,
                data          DATE         NOT NULL,
                saida         TIME,
                chegada       TIME,
                kmComeco      DECIMAL(10,1) DEFAULT 0,
                kmFinal       DECIMAL(10,1) DEFAULT 0
            )`;
        await conn.query(sql);
    }

    static async criarTabelaVisitas() {
        const conn = await this.connection();
        const sql = `
            CREATE TABLE IF NOT EXISTS visitas (
                codigo            INT          AUTO_INCREMENT PRIMARY KEY,
                codigoRota        INT          NOT NULL,
                codigoCliente     INT          NOT NULL,
                endereco          VARCHAR(200) NOT NULL,
                encontrado        TINYINT      NOT NULL DEFAULT 0,
                coordenadas       VARCHAR(50),
                fotoResidencia    TINYINT      DEFAULT 0,
                fotoResidenciaUrl VARCHAR(255),
                fotoDoc           TINYINT      DEFAULT 0,
                fotoDocUrl        VARCHAR(255),
                renegociado       TINYINT      NOT NULL DEFAULT 0,
                agendamento       TINYINT      NOT NULL DEFAULT 0,
                data_agendamento  DATE,
                novoTelefone          VARCHAR(20),
                codigoVeiculo INT,
                codigoCobrador INT,
                data date not null,
                saida time not null,
                chegada time not null,
                kmComeco DECIMAL(10,1) DEFAULT 0,
                kmFinal DECIMAL(10,1) DEFAULT 0,
                observacoes       VARCHAR(500),
                CONSTRAINT fk_visita_rota
                    FOREIGN KEY (codigoRota) REFERENCES rotas(codigo) ON DELETE CASCADE,
                CONSTRAINT fk_veiculos
                FOREIGN KEY (codigoVeiculo)  REFERENCES veiculos(codigo),
                CONSTRAINT fk_cobrador
                    FOREIGN KEY (codigoCobrador) REFERENCES usuarios(codigo)
            )`;
        await conn.query(sql);
    }

    static async criarTabelaPagamentos() {
        const conn = await this.connection();
        const sql = `
            CREATE TABLE IF NOT EXISTS pagamentos (
                codigo        INT          AUTO_INCREMENT PRIMARY KEY,
                codigoVisita  INT          NOT NULL UNIQUE,
                contrato      VARCHAR(50)  NOT NULL,
                parcelas      INT          NOT NULL,
                valor         DECIMAL(10,2) NOT NULL,
                CONSTRAINT fk_pagamento_visita
                    FOREIGN KEY (codigoVisita) REFERENCES visitas(codigo) ON DELETE CASCADE
            )`;
        await conn.query(sql);
    }

    static async criarTabelaRenegociacoes() {
        const conn = await this.connection();
        const sql = `
            CREATE TABLE IF NOT EXISTS renegociacoes (
                codigo         INT      AUTO_INCREMENT PRIMARY KEY,
                codigoVisita   INT      NOT NULL,
                contrato       VARCHAR(50)   NOT NULL,
                parcelas       INT           NOT NULL,
                valor          DECIMAL(10,2) NOT NULL,
                data_registro  DATETIME      DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_renegociacao_visita
                    FOREIGN KEY (codigoVisita) REFERENCES visitas(codigo) ON DELETE CASCADE
            )`;
        await conn.query(sql);
    }

    static async criarTodasTabelasConciliacao() {
        await this.criarTabelaVeiculos();
        await this.criarTabelaRotas();
        await this.criarTabelaVisitas();
        await this.criarTabelaPagamentos();
        await this.criarTabelaRenegociacoes();
    }

    static async setVeiculo(veiculo) {
        const conn = await this.connection();
        const sql = `
            INSERT INTO veiculos (nome, modelo, cor, placa, chassi)
            VALUES (?, ?, ?, ?, ?)`;
        const dados = [veiculo.nome, veiculo.modelo, veiculo.cor, veiculo.placa, veiculo.chassi];
        const [resultado] = await conn.query(sql, dados);
        return resultado;
    }

    static async getVeiculos() {
        const conn = await this.connection();
        const [rows] = await conn.query(`SELECT * FROM veiculos ORDER BY nome`);
        return rows;
    }

    static async setRota(rota) {
        const conn = await this.connection();
        const sql = `
            INSERT INTO rotas (nome)
            VALUES (?)`;
        const dados = [
            rota.nome
        ];
        const [resultado] = await conn.query(sql, dados);
        return resultado;
    }

    static async getRotas(skip, limit) {
        const conn = await this.connection();
        const sql = `
            SELECT rotas.codigo as codigoRota,
            rotas.nome as nomeRota,
            count(visitas.codigo) as quantidadeDeVisitas
            FROM rotas
            LEFT JOIN visitas on visitas.codigoRota = rotas.codigo
            SKIP ? LIMIT ? 
            GROUP BY rotas.nome;
        `;
        const parametrosPaginacao = [skip, limit]
        const [resultado] = await conn.query(sql, parametrosPaginacao);
        return resultado;
    }

    static async setVisita(visita) {
        const conn = await this.connection();
        const sql = `
            INSERT INTO visitas (
                codigoRota, codigoCliente, codigoVeiculo, codigoCobrador, endereco,
                encontrado, coordenadas,
                fotoResidencia, fotoResidenciaUrl,
                fotoDoc, fotoDocUrl,
                renegociado, agendamento, data_agendamento,
                novoTelefone,
                data, saida, chegada, kmComeco, kmFinal,
                observacoes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const dados = [
            visita.codigoRota, visita.codigoCliente, visita.codigoVeiculo, visita.cobrador,
            visita.endereco,
            visita.encontrado ?? 0, visita.coordenadas ?? null,
            visita.fotoResidencia ?? 0, visita.fotoResidenciaUrl ?? null,
            visita.fotoDoc ?? 0, visita.fotoDocUrl ?? null,
            visita.renegociado ?? 0, visita.agendamento ?? 0,
            visita.data_agendamento ?? null,
            visita.novoTelefone ?? null,
            visita.data, visita.saida, visita.chegada,
            visita.kmComeco ?? 0, visita.kmFinal ?? 0,
            visita.observacoes ?? null
        ];
        const [resultado] = await conn.query(sql, dados);
        return resultado;
    }

    static async setPagamento(pagamento) {
        const conn = await this.connection();
        const sql = `
            INSERT INTO pagamentos (codigoVisita, contrato, parcelas, valor)
            VALUES (?, ?, ?, ?)`;
        const dados = [pagamento.codigoVisita, pagamento.contrato, pagamento.parcelas, pagamento.valor];
        const [resultado] = await conn.query(sql, dados);
        return resultado;
    }

    static async setRenegociacao(renegociacao) {
        const conn = await this.connection();
        const sql = `
            INSERT INTO renegociacoes (codigoVisita, contrato, parcelas, valor)
            VALUES (?, ?, ?, ?)`;
        const dados = [renegociacao.codigoVisita, renegociacao.contrato, renegociacao.parcelas, renegociacao.valor];
        const [resultado] = await conn.query(sql, dados);
        return resultado;
    }

    static async updateFotosVisita(codigoVisita, { fotoResidenciaUrl, fotoDocUrl }) {
        const conn = await this.connection();
        const sql = `
            UPDATE visitas
            SET fotoResidencia    = ?,
                fotoResidenciaUrl = ?,
                fotoDoc           = ?,
                fotoDocUrl        = ?
            WHERE codigo = ?`;
        const dados = [
            fotoResidenciaUrl ? 1 : 0,
            fotoResidenciaUrl ?? null,
            fotoDocUrl ? 1 : 0,
            fotoDocUrl ?? null,
            codigoVisita
        ];
        const [resultado] = await conn.query(sql, dados);
        return resultado;
    }
}

module.exports = ConciliacaoDao;
