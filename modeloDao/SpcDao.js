

class SpcDao {

    constructor(connection) {
        this.connection = connection;
    }


    async adiciona(dados) {

        const colunas = ["codigoSpc", "cpfCnpj", "consumidor", "contrato", "dataVencimento", "valorDebito",
            "dataInclusao", "horaInclusao", "dataExclusao", "tipoNotificacao", "codigoNotificacao ",
            "codAssociado"];

        const sql = `insert into spc (${colunas.join(",")}) values ?`;

        try {
            const conn = await this.connection();

            const [resultado] = await conn.query(sql, [dados]);

            return resultado;

        } catch (erro) {

            console.error(erro);
            throw new Error("erro ao tentar cadastro os clientes negativados na tabela spc", erro.message);

        }

    }
	
	async listar() {
		try {
			const conn = await this.connection();
			const [resultado] = await conn.query("SELECT * FROM spc ORDER BY dataInclusao DESC");
			return resultado;
		} catch(erro) {
			console.error(erro);
			throw new Error("Erro ao listar registros da tabela spc");
		}
	}

	async remove() {
		const sql = "select from spc";
		try {
			
			const conn = await this.connection();
			const [resultado] = await conn.query(sql);
			return resultado;
			
		} catch(erro) {
			console.error(erro);
			throw new Error("Erro ao tentar remover a tabela spc");
		}
	}
	
	
	

    static async criarTabelaSpc(connection) {
        const colunas = ["codigoSpc int not null", "cpfCnpj varchar(255) not null", "consumidor varchar(255) not null",
            "contrato varchar(255) not null", "dataVencimento date not null", "valorDebito decimal(15,6)", "dataInclusao date not null",
            "horaInclusao time not null", "dataExclusao date", "tipoNotificacao varchar(255)",
            "codigoNotificacao int", "codAssociado int not null"];

        const sql = `create table if not exists spc (${colunas.join(",")})`;

        try {

            const conn = await connection();
            await conn.query(sql);


        } catch (error) {
            console.error(error);
            throw new Error("Erro ao tentar criar a tabela spc");
        }
    }

}


module.exports = SpcDao;



