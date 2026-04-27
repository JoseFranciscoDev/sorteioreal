const ClienteSerasa = require("./ClienteSerasa");

class SerasaStrategy {

    map(dados) {
        return  dados.map(cliente => {
            
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


    salvar(dados) {

    }
}


module.exports = SerasaStrategy;