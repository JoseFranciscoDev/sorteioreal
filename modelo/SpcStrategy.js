const ClienteSpc = require("./ClienteSpc.js")
const SpcDao = require("../modeloDao/SpcDao.js");
const connection = require("../databases/conexao.js");
const Data = require("../utilitarios/Data.js");

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
		           cliente.codigoSpc,
		           cliente.cpfCnpj,
		           cliente.consumidor,
		           cliente.contrato,
		           Data.dataParaBancoDeDados(cliente.dataVencimento),
		           cliente.valorDebito,
		           Data.dataParaBancoDeDados(cliente.dataInclusao),
		           cliente.horaInclusao,
		           Data.dataParaBancoDeDados(cliente.dataExclusao),
				   cliente.tipoNotificacao,
				   cliente.codigoNotificacao,
				   cliente.codAssociado
		           
		       ]);

				//console.log(dadosBanco);

		       try {

		           const spcDao = new SpcDao(connection);
		           const resultado = await spcDao.adiciona(dadosBanco);
		           console.log(`Sucesso! ${resultado.affectedRows} registros inseridos.`);
		           return resultado;

		       } catch (erro) {
		           return erro;
		       }
		

    }
	
	async deletar() {
		try {
			const spcDao = new SpcDao(connection);
			const resultado = SpcDao.remove();
			return resultado;
		} catch(erro) {
			return erro;
		}
		
	}
	
	
	
}


module.exports = SpcStrategy;