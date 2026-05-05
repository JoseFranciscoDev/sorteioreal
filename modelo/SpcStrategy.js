const ClienteSpc = require("./ClienteSpc.js")
const SpcDao = require("../modeloDao/SpcDao.js");
const connection = require("../databases/conexao.js");

class SpcStrategy {

    map(dados) {
        return  dados.map(cliente => {
          return new ClienteSpc(
          cliente.codigo_spc,
          cliente.cpf_cnpj,
          cliente.consumidor,
          cliente.contrato,
          cliente.data_vencimento,
          cliente.valor_debito,
          cliente.data_inclusao,
          cliente.hora_inclusao,
          cliente.data_exclusao,
          cliente.tipo_notificacao,
          cliente.codigo_notificacao,
          cliente.cod_associado); 

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

		           const spcDao = new SpcDao(connection);
		           const resultado = await spcDao.adiciona(dadosBanco);
		           console.log(`Sucesso! ${resultado.affectedRows} registros inseridos.`);
		           return resultado;

		       } catch (erro) {
		           return erro;
		       }
		

    }
}


module.exports = SpcStrategy;