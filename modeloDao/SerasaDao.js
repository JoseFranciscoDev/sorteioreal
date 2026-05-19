
class SerasaDao {

    constructor(connection) {
        this.connection= connection;
    }

    async adiciona(dados) {
        try {

            const colunas = ["status", "id", "nomeDevedorPrincipal", "tipoPessoa", "documento", "natureza" ,"valor",
                "dataCadastro", "dataOcorrenciaVencimento", "operacao"];

              const sql = `insert into serasa (${colunas.join(",")}) values ?`;
                const conn = await this.connection();
               const [resultado] = await conn.query(sql, [dados]);
                
               return resultado;    

        } catch(erro) {
            console.log(erro);
            throw new Error("erro ao tentar cadastro os clientes negativados na tabela serasa", erro.message);
        }

    }
	
	async listar() {
		try {
			const conn = await this.connection();
			const [resultado] = await conn.query("SELECT * FROM serasa ORDER BY dataCadastro DESC");
			return resultado;
		} catch(erro) {
			console.error(erro);
			throw new Error("Erro ao listar registros da tabela serasa");
		}
	}

	async remove() {
		const sql = "select from serasa";
		try {
			
			const conn = await this.connection();
			const [resultado] = await conn.query(sql);
			return resultado;
			
		} catch(erro) {
			console.error(erro);
			throw new Error("Erro ao tentar remover a tabela serasa");
		}
	}


    static async criarTabelaSerasa(conexao) {
        try {
            const conn = await conexao();
             const sql = `
            create table if not exists serasa(
                status varchar(255) not null,
                id int not null,
                nomeDevedorPrincipal varchar(255) not null,
                tipoPessoa varchar(255) not null,
                documento varchar(255) not null,
                natureza varchar(255) not null,
                valor decimal(15,6) not null,
                dataCadastro timestamp not null,
                dataOcorrenciaVencimento date not null,
                operacao varchar(255) not null
            )`;

            await conn.query(sql);

        } catch(erro) {

            throw new Error("Erro ao tentar criar a tabela serasa");
        }
       



    }

}


module.exports = SerasaDao;