const ClienteProtesto = require("./ClienteProtesto.js");

class ProtestoStrategy {

    map(dados) {
        return  dados.map(cliente => {
            console.log(dados);
          return new ClienteProtesto(
          cliente.n_pedido,
          cliente.comarca_cartorio,
          cliente.data_solicitacao,
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
          cliente.status_pedido,
          cliente.irregularidade,
          cliente.ocorrencia_titulo,
          cliente.data_ocorrencia); 

        });
    }


    salvar(dados) {
        console.log(dados)
    }
}


module.exports = ProtestoStrategy;