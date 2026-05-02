const AbstractNerus = require("./AbstractNerusAWS.js");

class ClienteNerusDao extends AbstractNerus {
    static async getCliente(cliente) {
        const conn = await this.connection();
        const texto = `select
                            custp.no as codigo,
                            custp.name as nome,
                            custp.sincedt as data_cadastro
                            
                            from custp where custp.no = ?`;
        const [resultado] = await conn.query(texto, [cliente.codigoCliente]);

        return resultado;

    }
    static async getClientes(codigosClientes) {
        const conn = await this.connection();
        const texto = `select
                            custp.no as codigo,
                            custp.name as nome,
                            custp.sincedt as data_cadastro
                            
                            from custp where custp.no in (?)`;
        const [clientes] = await conn.query(texto, [codigosClientes]);

        return clientes;

    }
}

module.exports = ClienteNerusDao;