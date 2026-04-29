
class ProtestoDao {


    constructor(connection) {

        this.connection = connection;

    }


    static async criarTabelaProtesto(connection) {
        try {
              const conn = await connection();
              const sql = `create table if not exists protesto (
                             numero_pedido integer not null,
                             comarca_cartorio varchar(255) not null,
                             data_solicitacao date not null,
                             comarca_devedor varchar(255) not null,
                             devedor varchar(255) not null,
                             doc_devedor varchar(255) not null,
                             numero_titulo integer not null,
                             valor_titulo decimal(15,6) not null,
                             valor_protestado decimal(15,6) not null,
                             protocolo integer,
                             data_protocolo date,
                             especie varchar(255) not null,
                             status_pedido varchar(255) not null,
                             irregularidade varchar(255),
                             ocorrencia_titulo varchar(255),
                             data_ocorrencia date null)`;

              await conn.query(sql);

        } catch(erro) {
            throw new Error("Erro ao tentar criar a tabela protesto");
        }
      
    }
}


module.exports = ProtestoDao;