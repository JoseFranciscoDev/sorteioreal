

class SpcDao {
	
	constructor(connection) {
		this.connection = connection;
	}
	
	
	async adiciona(dados) {
		
		console.log(dados);
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
			
			
		} catch(error) {
			console.error(error);
			throw new Error("Erro ao tentar criar a tabela spc");
		}
	}
	
}



module.exports = SpcDao;



