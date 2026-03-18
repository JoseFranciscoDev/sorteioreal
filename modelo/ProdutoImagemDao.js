

class ProdutoImagemDao {

    constructor(conexao) {
        this.conexao = conexao;
    }


    async salvarImagem(dados) {
        const sql = `insert into produto_imagens (codigo_produto, imagem_nome, imagem_url, codigo_usuario)
        values (?, ?, ?, ?)`;

        const valores = [
            dados.codigo_produto,
            dados.imagem_nome,
            dados.imagem_url,
            dados.codigo_usuario
        ];

        const [resultado] = await this.conexao.query(sql, valores);
        return resultado;
    }
    
    
    static async criarTabela(conexao) {
        
        const sql = `create table if not exists produto_imagens (
                         id int not null primary key auto_increment,
                         codigo_produto int not null,
                         imagem_nome varchar(255),
                         imagem_url varchar(255),
                         codigo_usuario int not null,
                         data_criacao datetime default current_timestamp,
                         data_atualizacao datetime default current_timestamp on update current_timestamp )`;
        
        
        await conexao.query(sql);
    }

}



module.exports = ProdutoImagemDao;
