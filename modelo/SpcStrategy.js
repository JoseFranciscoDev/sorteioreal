const ClienteSpc = require("./ClienteSpc.js")
const SpcDao = require("../modeloDao/SpcDao.js");
const connection = require("../databases/conexao.js");
const connectionNerus = require("../databases/ConexaoNerusAWS.js");
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
	
	
	async conciliarClientes() {
		
			try {
				const spcDao = new SpcDao(connection, connectionNerus);
				
				const [listaSpc, listaNerus] = await Promise.all(
					[spcDao.buscarClientesNegativados(), spcDao.buscarClientesNegativadosNerus()]);
							
				if (listaSpc instanceof Error || listaNerus instanceof Error) {
					throw new Error("Error ao buscar dados de uma das bases");
				}
				
				const gerarChave = (contrato, parcela) => `${Number(contrato)}_${Number(parcela)}`;
				
				const contratosInteirosNoSpc = new Set();
				const setSpcChaveComposta = new Set();
				
				listaSpc.forEach(c => {
					const numContrato = Number(c.contrato);
					const numParcela = Number(c.parcela || 0);
					
					if (numParcela === 0) {
						contratosInteirosNoSpc.add(numContrato);
					} else {
						setSpcChaveComposta.add(gerarChave(numContrato, numParcela));
					}
				});
				
				
				const contratosNoNerus = new Set();
				const setNerusChaveComposta = new Set();
				
				
				listaNerus.forEach(n => {
					const numContrato = Number(n.contrato);
					const numParcela = Number(n.parcela || 0);
					
					contratosNoNerus.add(numContrato);
					setNerusChaveComposta.add(gerarChave(numContrato, numParcela));
				});
				
				
				const apenasNoSpc = listaSpc.filter(c => {
					const numContrato = Number(c.contrato);
					const numParcela = Number(c.parcela || 0);
					
					if (numParcela === 0) {
						return !contratosNoNerus.has(numContrato);
					}
					
					const chave = gerarChave(numContrato, numParcela);
					return !setNerusChaveComposta.has(chave);
				});
				
				
				const apenasNoNerus = listaNerus.filter(c => {
					const numContrato = Number(c.contrato);
					const numParcela = Number(c.parcela || 0);
					
					if (contratosInteirosNoSpc.has(numContrato)) {
						return false;
					}
					
					const chave = gerarChave(numContrato, numParcela);
					return !setSpcChaveComposta.has(chave);
				});
				
				
				const spcSemDuplicados = Array.from(
					new Map(apenasNoSpc.map(c => [`${Number(c.contrato)}_${Number(c.parcela || 0)}`, c])).values()
				);
				
				const nerusAgrupadoPorContrato = [];
				const contratosProcessados = new Set();
				
				// ✅ CORREÇÃO: Alterado para ler a variável correta "apenasNoNerus"
				apenasNoNerus.forEach(n => {
					const numContrato = Number(n.contrato);
					
					if (!contratosProcessados.has(numContrato)) {
						contratosProcessados.add(numContrato);
						
						// Busca as parcelas associadas a esse contrato específico
						const todasAsParcelasDesteContrato = apenasNoNerus
							.filter(p => Number(p.contrato) === numContrato)
							.map(p => Number(p.parcela || 0));
							
						nerusAgrupadoPorContrato.push({
							contrato: numContrato,
							totalParcelasDivergentes: todasAsParcelasDesteContrato.length,
							parcelasComProblema: todasAsParcelasDesteContrato
						});
					}
				});			
				
				return {
					sucesso: true,
					resumoContratos: {
						totalContratosFaltasSincronizarNoNerus: spcSemDuplicados.length,
						totalContratosParaLimparNoNerus: nerusAgrupadoPorContrato.length,
						totalDivergenciasReais: spcSemDuplicados.length + nerusAgrupadoPorContrato.length
					},
					detalhes: {
						esquecidoNoNerus: spcSemDuplicados,
						limparNoNerus: nerusAgrupadoPorContrato
					}				
				};
				
			} catch(erro) {
				console.error("Erro na conciliação:", erro);
				return {
					sucesso: false,
					erro: "Falha ao processar conciliação",
					detalhe: erro.message
				};
			}
	}

	
	
	
}


module.exports = SpcStrategy;