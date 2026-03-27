

class ProdutoImagemDao {

    constructor(conexao, conexaoAWS = null) {
        this.conexao = conexao;
        this.conexaoAWS = conexaoAWS;
    }


    async buscarImagensProdutos(limit, offset) {
        const sql = `
            SELECT pi.* FROM produto_imagens pi
            INNER JOIN (
                SELECT MIN(id) as min_id FROM produto_imagens GROUP BY codigo_produto
            ) t ON pi.id = t.min_id
            LIMIT ? OFFSET ?
        `;
        const conn = await this.conexao();

        if (!conn) {
            return [];
        }

        const [produtos] = await conn.query(sql, [limit, offset]);
        return produtos;
    }

    async buscarImagensPorCodigo(codigo_produto) {
        const sql = `SELECT * FROM produto_imagens WHERE codigo_produto = ?`;
        const conn = await this.conexao();

        if (!conn) {
            return [];
        }

        const [imagens] = await conn.query(sql, [codigo_produto]);
        return imagens;
    }

    async contarTotalImagens() {
        const sql = `SELECT COUNT(DISTINCT codigo_produto) as total FROM produto_imagens`;
        const conn = await this.conexao();

        if (!conn) {
            return 0;
        }

        const [[resultado]] = await conn.query(sql);
        return resultado.total;
    }

    async buscarDadosProdutos(codigoProduto, loja) {

        const sql2 = `select round(trim(prd.no)) as codigo,
        prd.name as produto,
        prp.refprice as preco,
        prdnam.name as descricaoCompleta
        from prp inner join prd on(prd.no = prp.prdno)
        inner join prdnam on(prd.no = prdnam.prdno)
        where prd.no in (?) and prp.storeno = ?`;

        const parametros = [codigoProduto, loja];

        const conn = await this.conexaoAWS();


        if (!conn) {

            return [];

        }

        const [resultado] = await conn.query(sql2, parametros);

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
