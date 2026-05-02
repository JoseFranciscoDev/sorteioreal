const ClienteProtesto = require("./ClienteProtesto.js");
const ProtestoDao = require("../modeloDao/ProtestoDao.js");
const conexao = require("../databases/conexao.js");
const Data = require("../utilitarios/Data.js");

class ProtestoStrategy {
  
    map(dados) {
        return  dados.map(cliente => {
          
          return new ClienteProtesto(
          cliente.n_pedido,
          cliente.comarca_cartorio,
          cliente.data_da_solicitacao,
          cliente.comarca_devedor,
          cliente.devedor,
          cliente.doc_devedor,
          cliente.n_titulo,
          cliente.valor_titulo,
          cliente.valor_protestado,
          cliente.protocolo,
          cliente.data_protocolo,
          cliente.especie,
          cliente.status_pedido,
          cliente.irregularidade,
          cliente.ocorrencia_titulo,
          cliente.data_ocorrencia); 

        });
    }


    async salvar(dados) {
           if (!dados || dados.length === 0) {
             return;   
            }
            
            const dadosBanco = dados.map(cliente=> [
                cliente.pedido,
                cliente.comarcaCartorio,
                Data.dataParaBancoDeDados(cliente.dataSolicitacao),
                cliente.comarcaDevedor,
                cliente.devedor,
                cliente.docDevedor,
                cliente.titulo,
                cliente.valorTitulo,
                cliente.valorProtestado,
                cliente.protocolo,
                Data.dataParaBancoDeDados(cliente.dataProtocolo),
                cliente.especie,
                cliente.statusPedido,
                cliente.irregularidade,
                cliente.ocorrenciaTitulo,
                Data.dataParaBancoDeDados(cliente.dataOcorrencia)


            ]);

        try {         

            const protestoDao = new ProtestoDao(conexao);
           const resultado =  await protestoDao.adiciona(dadosBanco);
           console.log(`Sucesso! ${resultado.affectedRows} registros inseridos.`);
           return resultado;          

        } catch(erro) {
            return erro;
        }
        
    }
}


module.exports = ProtestoStrategy;
