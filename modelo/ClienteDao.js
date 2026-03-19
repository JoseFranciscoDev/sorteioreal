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

    static async getClientes() {
        const conn = await this.connection();
        const texto = `select id,
                        codigoUsuario,
                        codigoVendedor,
                        codigoCliente,
                        codigoPedido,
                        date_format(data, "%Y%m%d") as data,
                        time(data) as hora
                        from vendedorclientes`;
        const [clientes] = await conn.query(texto);
        return clientes;
    };

    static async criarTabela() {
        const conn = await this.connection();
        const texto = ` create table if not exists vendedorclientes(
                        id int not null primary key auto_increment,
                        codigoUsuario int not null,
                        codigoVendedor int not null,
                        codigoCliente int not null,
                        codigoPedido int not null)`;
        await conn.query(texto);
    };
};

module.exports = ClienteDao;