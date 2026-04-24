const {lerArquvioUniversal} = require("../utilitarios/LerArquivo.js");
const ClienteSpc = require("../modelo/ClienteSpc.js");
const Data = require("../utilitarios/Data.js")

class ClienteNegativadoProtestado {


    
    async uploads(req, res) {
        
        
        const [arquivoUrl] = req.files;
      const dados = await  lerArquvioUniversal(arquivoUrl.path);

      

      const clienteSpc = dados.map(cliente => {

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


     clienteSpc.forEach(cliente => {

          console.log(`codigoSpc: ${cliente.codigoSpc} | cpfCnpj: ${cliente.cpfCnpj} | consumidor: ${cliente.consumidor} | contrato: ${cliente.contrato} |
            dataVencimento: ${Data.dataParaTexto(cliente.dataVencimento)} | valorDebito: ${cliente.valorDebito} | dataInclusao: ${Data.dataParaTexto(cliente.dataInclusao)} |
            horaInclusao: ${cliente.horaInclusao} | dataExclusao: ${Data.dataParaTexto(cliente.dataExclusao)} | tipoNotificacao: ${cliente.tipoNotificacao} |
            codigoNotificacao: ${cliente.codigoNotificacao} | codAssociado: ${cliente.codAssociado}`);
      });






      return res.json({dados});

            
        
    }
}


module.exports = ClienteNegativadoProtestado;


