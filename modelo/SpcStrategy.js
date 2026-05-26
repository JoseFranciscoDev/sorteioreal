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
	
	
	compararResultados(resultadoSPC, resultadoNerus) {
		
		const clientesEmRisco = [];
		
		const statusNerus = {
			1: "Quitado",
			2: "Pagamento Parcial",
			3: "SPC (Negativado)",
			4: "Cobrador",
			5: "Cancelado/Renegociado"
		}
		
		
		const mapaNerus = new Map();
		
		for (const item of resultadoNerus) {
			const contratoStr = String(item.contrato).trim();
			const parcelaStr = String(item.parcela).trim();
			const statusNum = Number(item.status);
			
			
			if (!mapaNerus.has(contratoStr)) {
				mapaNerus.set(contratoStr, []);
			}
			
			mapaNerus.get(contratoStr).push({
				parcela: parcelaStr,
				status: statusNum,
				statusTexto: statusNerus[statusNum] || `Status ${statusNum}`
			});
		}
		
		
		for (const spc of resultadoSPC) {
			const contratoSPC = String(spc.contrato).trim();
			const parcelaSPC = String(spc.parcela).trim();
			
			const parcelasNoNerus = mapaNerus.get(contratoSPC) || [];
			
			if (parcelasNoNerus.length === 0) {
				
				clientesEmRisco.push({
					cpfCnpj: spc.cpfCnpj,
					contrato: contratoSPC,
					parcelaSPC: parcelaSPC === "0" ? "Contrato Inteiro": parcelaSPC,
					motivo: "O Contrato consta no SPC mas não existe no Nerus.",
					gravidade: "CRITICA",
					acao: "REMOVER IMEDIATAMENTE DO SPC"
				});
				
				continue;
			}
			
			
			if (parcelaSPC === "0") {
				const tudoRegularizado = parcelasNoNerus.every(p => p.status === 1 || p.status === 5);
				const possuiParcelaPaga = parcelasNoNerus.some(p => p.status === 1 || p.status === 5);
				
				if (tudoRegularizado) {
					clientesEmRisco.push({
						cpfCnpj: spc.cpfCnpj,
						contrato: contratoSPC,
						parcelaSPC: "Contrato Inteiro (0)",
						motivo: "O contrato inteiro está negativado, mas todas as parcelas estão pagas/renegociadas no Nerus.",
						gravidade: "CRITICA",
						acao: "REMVOER IMEDIATAMENTE DO SPC (Evitar Processo)"
					});
				} else if (possuiParcelaPaga) {
					clientesEmRisco.push({
						cpfCnpj: spc.cpfCnpj,
						contrato: contratoSPC,
						parcelaSPC: "Contrato Inteiro (0)",
						motivo: "Contrato inteiro negativado, mas o cliente ja pagou algumas parcelas na loja.",
						gravidade: "ALTA",
						acao: "REMOVER CONTRATO INTEIRO E NEGATIVADO APENAS AS PARCELAS EM ABERTO"
					});
				}
			} else {
				const parcelaEncontrada = parcelasNoNerus.find(p => p.parcela === parcelaSPC);
				
				if (!parcelaEncontrada) {
					clientesEmRisco.push({
						cpfCnpj: spc.cpfCnpj,
						contrato: contratoSPC,
						parcelaSPC: parcelaSPC,
						motivo: `A parcela ${parcelaSPC} está no SPC mas não existe no historico do Nerus.`,
						gravidade: "ALTA",
						acao: "REMOVER PARCELA DO SPC"
					});
				} else if (parcelaEncontrada.status === 1 || parcelaEncontrada.status === 5) {
					clientesEmRisco.push({
						cpfCnpj: spc.cpfCnpj,
						contrato: contratoSPC,
						parcelaSPC: parcelaSPC,
						motivo: `A parcela está ativa no SPC, mas consta como [${parcelaEncontrada.statusTexto}] no Nerus.`,
						gravidade: "CRITICA",
						acao: "REMOVER IMEDIATAMENTE DO SPC (Cliente ja pagou/acordou na loja)"
					});
				} else if (parcelaEncontrada.status === 2) {
					clientesEmRisco.push({
						cpfCnpj: spc.cpfCnpj,
						contrato: contratoSPC,
						parcelaSPC: parcelaSPC,
						motivo: `A parcela está no SPC, mas o cliente fez um [Pagamento Parcial] na loja`,
						gravidade: "MEDIA",
						acao: "ATUALIZAR VALOR DA NEGATIVAÇÃO NO SPC (Abater a metade paga)"
					});
				}
			}
			
		}
		
		return clientesEmRisco;
	}
	
	
	async executarAuditoriaDefensiva() {
		
		try {
			console.log("[AUDITORIA] Coletando registros ativos do SPC...");
			
			const spcDao = new SpcDao(connection, connectionNerus);
			
			const dadosSPC = await spcDao.buscarClientesNegativados();
			
			if (!dadosSPC || dadosSPC.length === 0) {
				console.log("[AUDITORIA] Sem registros ativos no SPC. Loja segura.");
				return [];
			}
			
			const listaContratosUnicos = [...new Set(dadosSPC.map(item => String(item.contrato).trim()))];
			console.log(`[AUDITORIA] Consultando ${listaContratosUnicos.length} contratos no Nerus...`);
			
			
			const dadosNerus = await spcDao.buscarClientesNegativadosNerus(listaContratosUnicos);
			console.log(`[AUDITORIA] Cruzando informações e avaliando riscos de processos...`);
			
			const relatorioRisco = this.compararResultados(dadosSPC, dadosNerus);
			
			const casosCriticos = relatorioRisco.filter(r => r.gravidade === "CRITICA");
			console.log(`\n=== RELATORIO DE AUDITORIA DE SPC ===`);
			console.log(`Total de irregularidades: ${relatorioRisco.length}`);
			console.log(`CASOS CRITICOS COM RISCO DE PROCESSO: ${casosCriticos.length}`);
			
			return relatorioRisco;
			
		} catch (erro) {
			console.error("[AUDITORIA] Falta ao rodar verificação de segurança:", erro);
			
			return [];
		}
	}
	
	
	
	
	
	

	
	
	
}


module.exports = SpcStrategy;