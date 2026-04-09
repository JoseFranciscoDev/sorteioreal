const Abstract = require("./Abstract.js");

class CupomDao extends Abstract {

    static async getPedidos() {
        const conn = await this.connection();

        const texto = `select codigo,
                        pedido,
                        date_format(data, "%d/%m/%Y") as data,
                        valor,
                        metodoPagamento,
                        quantidade,
                        cliente,
                        nome,
                        cpf,
                        usuario
                          from cupons;`;
        const [resultado] = await conn.query(texto);
        return resultado;
    }

    static async getCupomCodigo(pedido) {
        const conn = await this.connection();
        const texto = `select
                        cupons.codigo,
                        cupons.pedido,
                        date_format(cupons.data, "%d/%m/%Y") as data,
                        cupons.valor,
                        cupons.cliente,
                        cupons.nome,
                        cupons.cpf,
                        ifnull(cupons.telefone_fisco, cupons.telefone_celular) as telefone,
                        cupons.bairro as endereco,
                        cupons.cidade,
                        cupons.cep,
                        cupons.estado,
                        cupons.quantidade
                          from cupons where cupons.pedido = ?;`;
        const [cupons] = await conn.query(texto, [pedido.codigo]);
        return cupons;

    }

    static async getCupom() {
        const conn = await this.connection();
        const texto = `select
                        cupons.codigo,
                        cupons.pedido,
                        date_format(cupons.data, "%d/%m/%Y") as data,
                        cupons.valor,
                        cupons.cliente,
                        cupons.nome,
                        cupons.cpf,
                        ifnull(cupons.telefone_fisco, cupons.telefone_celular) as telefone,
                        cupons.bairro as endereco,
                        cupons.cidade,
                        cupons.cep,
                        cupons.estado,
                        cupons.quantidade
                          from cupons;`;
        const [cupons] = await conn.query(texto);
        return cupons;
    }
    static async setCupom(pedido) {
        const conn = await this.connection();
        const texto = `insert
                into cupons
                 (cupons.data,
                  cupons.pedido,
                 cupons.valor,
                 cupons.metodoPagamento,
                 cupons.quantidade,
                 cupons.cliente,
                 cupons.nome,
                 cupons.cpf,
                 cupons.telefone_fisco,
                 cupons.telefone_celular,
                 cupons.bairro,
                 cupons.cidade,
                 cupons.cep,
                 cupons.estado,
                 usuario)
                  values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const dados = [pedido.data, pedido.codigo, pedido.valor, pedido.metodoPagamento, pedido.quantidade,
        pedido.cliente, pedido.nome, pedido.cpf, pedido.telefone_fisco,
        pedido.telefone_celular, pedido.bairro, pedido.cidade,
        pedido.cep, pedido.estado, pedido.usuario];
        const [cupom] = await conn.query(texto, dados);
        return cupom.insertId;

    }

    static async delete(codigo) {
        const conn = await this.connection();
        const texto = `delete from cupons where cupons.codigo = ?`;
        
        const [cupom] = await conn.query(texto, [codigo]);
        return cupom;
    }

    static async update(pedido) {
        const conn = await this.connection();
        const texto = `update cupons set cupons.cliente = ?, cupons.nome = ?, cupons.cpf = ?,
        cupons.telefone_fisco = ?, cupons.telefone_celular = ?,
        cupons.bairro = ?, cupons.cidade = ?, cupons.estado = ?,
        cupons.cep = ? where cupons.pedido = ?`;
        const dadosPedido = [pedido.cliente, pedido.nome, pedido.cpf, pedido.telefone_fisco,
        pedido.telefone_celular, pedido.bairro, pedido.cidade, pedido.estado, pedido.cep,
        pedido.codigo];
        const [cupom] = await conn.query(texto, dadosPedido);
        return cupom;
    }

    static async criarTabela() {
        const conn = await this.connection();
        const texto = ` create table if not exists cupons (
                        codigo int not null primary key auto_increment,
                        pedido int not null check (pedido > 0) unique,
                        data date not null,
                        valor numeric(8,2) not null check(valor > 0),
                        metodoPagamento varchar(255) not null,
                        quantidade int not null check(quantidade > 0),
                        cliente int not null,
                        nome varchar(255) not null,
                        cpf varchar(255) not null,
                        telefone_fisco varchar(255),
                        telefone_celular varchar(255),
                        bairro varchar(255) not null,
                        cidade varchar(255) not null,
                        cep varchar(255) not null,
                        estado varchar(255) not null,
                        usuario int not null)`;
        await conn.query(texto);
    }

}



module.exports = CupomDao;

