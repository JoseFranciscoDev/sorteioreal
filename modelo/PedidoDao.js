const AbstractNerusAWS = require("./AbstractNerusAWS.js");

class PedidoDao extends AbstractNerusAWS {
    
    static async getPedido (pedido) {
        const conn = await this.connection();
        const texto = `select 
                            eord.ordno as codigo,
                            date_format(eord.date, "%Y-%m-%d") as data,
                            eord.custno as cliente,
                            ((eord.amount - eord.discount) / 100) valor,
                            paym.name as metodoPagamento                            
                             from eord left join paym on(eord.paymno = paym.no) where eord.ordno = ?
                                    and eord.status in(3,8)`;
        const [resultado] = await conn.query(texto,[pedido.codigo]);
        
        return resultado;
    }
    
    static async getCliente(pedido) {
        const conn = await this.connection();
        const texto = `select
                            custp.no as codigo,
                            custp.name as nome,
                            custp.cpf_cgc as cpf,
                            ifnull(substring_index(custp.ddd, " ", 1), " ") as ddd,
                            ifnull(substring_index(custp.tel, " ", 1), " ") as telefone_fisco,
                            ifnull(substring_index(custp.celular, " ", 1), " ") as telefone_celular,
                            custp.nei1 as bairro,
                            custp.city1 as cidade,
                            ifnull(substring_index(custp.zip, " ", 1), " ") as cep,
                            custp.state1 as estado
                            
                            from custp where custp.no = ?`;
        const [cliente] = await conn.query(texto,[pedido.codigo]);
        
        return cliente;
        
    }
}

module.exports = PedidoDao;