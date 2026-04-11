const Abstract = require("./Abstract.js");

class CuponsClientesDao extends Abstract {

    static async setCupom(cupom) {
        const conn = await this.connection();
        const texto = `insert into cuponsClientes(
                        cuponsClientes.codigoCupom,
                        cuponsClientes.cliente,
                        cuponsClientes.pedido,
                        cuponsClientes.valor,
                        cuponsClientes.data)
                    values(?, ?, ?, ?, ?)`;
        await conn.query(texto, [cupom.codigoCupom, cupom.cliente,
        cupom.pedido, cupom.valor, cupom.data]);
    }

    static async getCupom(cupom) {
        const conn = await this.connection();
        const texto = `
                    select
                     cuponsClientes.codigo,
                     date_format(cuponsClientes.data, "%d/%m/%Y") as data,
                     cupons.nome,
                     cupons.cpf,
                     cupons.bairro as endereco,
                     cupons.cidade,
                     cupons.estado,
                     ifnull(cupons.telefone_fisco,cupons.telefone_celular) as telefone
                    from cuponsClientes join cupons
                         on(cuponsClientes.codigoCupom = cupons.codigo) 
                    where cuponsClientes.codigoCupom = ?`;
        const [resultado] = await conn.query(texto, [cupom.codigoCupom]);

        return resultado;
    }

    static async getCupomPedido(cupom) {
        const conn = await this.connection();
        const texto = `
                    select
                     cuponsClientes.codigo,
                     date_format(cuponsClientes.data, "%d/%m/%Y") as data,
                     cupons.nome,
                     cupons.cpf,
                     cupons.bairro as endereco,
                     cupons.cidade,
                     cupons.estado,
                     ifnull(cupons.telefone_fisco,cupons.telefone_celular) as telefone
                    from cuponsClientes join cupons
                         on(cuponsClientes.codigoCupom = cupons.codigo) 
                    where cuponsClientes.pedido = ? 
                    and cuponsClientes.codigo >= ?`;
        const [resultado] = await conn.query(texto, [cupom.pedido, cupom.ultimoCupom]);

        return resultado;
    }

    static async getCuponsPorPedido(pedido) {
        const conn = await this.connection();
        const texto = `
                    select
                     cuponsClientes.codigo,
                     cuponsClientes.codigoPedido
                     date_format(cuponsClientes.data, "%d/%m/%Y") as data,
                     cupons.nome,
                     cupons.cpf,
                     cupons.bairro as endereco,
                     cupons.cidade,
                     cupons.estado,
                     ifnull(cupons.telefone_fisco,cupons.telefone_celular) as telefone
                    from cuponsClientes join cupons
                         on(cuponsClientes.codigoCupom = cupons.codigo and codigoClientes.pedido = cupons.pedido) 
                    where cuponsClientes.pedido = ?`;
        const [resultado] = await conn.query(texto, [pedido]);

        return resultado;
    }



    static async delete() {
        return;
    }

    static async update() {
        return;
    }

    static async criarTabela() {
        const conn = await this.connection();
        const texto = ` create table if not exists cuponsClientes(
                            codigo int not null primary key auto_increment,
                            codigoCupom int not null,
                            cliente int not null,
                            pedido int not null,
                            valor numeric(8,2) not null,
                            data date not null,
                            foreign key (codigoCupom) references cupons (codigo) on delete cascade)`;
        await conn.query(texto);

    }
    static async verificarCuponsImpressos(pedidos) {
        const conn = await this.connection();

        const texto = `select
                        c.pedido as codigoPedido,
                        count(cc.codigo) as quantidadeImpressa,
                        c.quantidade as quantidadeCuponsPedido,
                        count(cc.codigo)=c.quantidade as todosCuponImpressos
                        from cupons c 
                        left join cuponsClientes cc on (c.pedido=cc.pedido and c.codigo=cc.codigoCupom)
                        where c.pedido in (?)
                        group by c.pedido;
                        `;
        const [resultado] = await conn.query(texto, [pedidos])

        return resultado
    }
}

module.exports = CuponsClientesDao;


