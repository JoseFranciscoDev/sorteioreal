

class ProdutoImagemDao {

    constructor(conexao, conexaoAWS = null) {
        this.conexao = conexao;
        this.conexaoAWS = conexaoAWS;
    }
    
    
    async buscarImagensProdutos() {
        const sql = `select * from produto_imagens`;
        const conn = await this.conexao();
        
        if (!conn) {
            return [];
        }
        
          const [produtos] = await conn.query(sql);
          
        return produtos;
    }
    
    async buscarDadosProdutos(codigoProduto, loja) {
        
        const sql2 = `select round(trim(prd.no)) as codigo, prd.name as produto, prp.refprice as preco from prp inner join prd on(prd.no = prp.prdno)
                       where prd.no in (?) and prp.storeno = ?`;
        
         const parametros = [codigoProduto,loja];
        
        const conn = await this.conexaoAWS();
        
        
        if (!conn) {
            
            return [];
            
        }
        
        const [resultado] = await conn.query(sql2,parametros); 
          
        return resultado;
        
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

	const conn = await this.conexao();
        const [resultado] = await conn.query(sql, valores);
        return resultado;
    }
    
    
    async buscarProdutoImagemId(id) {
        
        const sql = `select * from produto_imagens where produto_imagens.id = ?`;
        
        
       const conn = await this.conexao();
       
       const [produto] =  await conn.query(sql, [id]);
       
       return produto;
    }
    
    async removeProdutoImagemId(id) {
        
        const sql = `delete from produto_imagens where produto_imagens.id = ?`;
        
        const conn = await this.conexao();
        
        const [resultado] = await conn.query(sql, [id]);
        
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
        
        
	const conn = await conexao();
        await conn.query(sql);
    }

}



module.exports = ProdutoImagemDao;
