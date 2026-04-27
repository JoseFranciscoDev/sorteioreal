
class ProtestoStrategy {

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


    salvar(dados) {

    }
}


module.exports = ProtestoStrategy;