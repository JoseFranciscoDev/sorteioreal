const Abstract = require("./Abstract.js");


class ClienteDao extends Abstract {
    static async setCliente(cliente) {
        const conn = await this.connection();
        const texto = `insert into vendedorclientes(codigoUsuario, codigoVendedor, codigoCliente, codigoPedido) values(?, ?, ?, ?)`;
        const dados = [cliente.codigoUsuario, cliente.codigoVendedor, cliente.codigoCliente, cliente.codigoPedido];
        const [clientes] = await conn.query(texto, dados);
        return clientes;
    };

    static async getClienteBingo(cliente) {
        const conn = await this.connection();
        const texto = `select * from vendedorclientes where vendedorclientes.codigoCliente = ?`;
        const [clientes] = await conn.query(texto, [cliente.codigoCliente]);
        return clientes;
    };

    static async getClienteNerus(pedido) {
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
        const [cliente] = await conn.query(texto, [pedido.codigo]);

        return cliente;

    }

    static async criarTabela() {
        const conn = await this.connection();
        const texto = ` create table if not exists vendedorclientes(
                        codigo int not null primary key auto_increment,
                        codigoUsuario int not null,
                        codigoVendedor int not null,
                        codigoCliente int not null,
                        codigoPedido int not null)`;
        await conn.query(texto);
    };
};

module.exports = ClienteDao;