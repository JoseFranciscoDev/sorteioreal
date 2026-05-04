const ClienteSerasa = require("./ClienteSerasa.js");
const SerasaDao = require("../modeloDao/SerasaDao.js");
const Data = require("../utilitarios/Data.js");
const conexao = require("../databases/conexao.js");

class SerasaStrategy {

    map(dados) {
        return dados.map(cliente => {

            return new ClienteSerasa(
                cliente.status,
                cliente.id,
                cliente.nome_do_devedor_principal,
                cliente.tipo_de_pessoa,
                cliente.documento,
                cliente.natureza,
                cliente.valor,
                cliente.data_de_cadastro,
                cliente.data_de_ocorrencia_vencimento,
                cliente.operacao);

        });
    }


    async salvar(dados) {
        if (!dados || dados.length === 0) {
            return;
        }


        const dadosBanco = dados.map(cliente => [
            cliente.status,
            cliente.id,
            cliente.nomeDevedor,
            cliente.tipoPessoa,
            cliente.documento,
            cliente.natureza,
            cliente.valor,
            Data.dataParaBancoDeDados(cliente.dataCadastro),
            Data.dataParaBancoDeDados(cliente.dataOcorrenciaVencimento),
            cliente.operacao
        ]);



        try {

            const serasaDao = new SerasaDao(conexao);
            const resultado = await serasaDao.adiciona(dadosBanco);
            console.log(`Sucesso! ${resultado.affectedRows} registros inseridos.`);
            return resultado;

        } catch (erro) {
            return erro;
        }


    }
}


module.exports = SerasaStrategy;
