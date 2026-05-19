const AbstractNerus = require("../modelo/AbstractNerusAWS");

class CatalogoDao extends AbstractNerus {
    async buscarProdutos(limit, offset, loja) {
        const conexao = await CatalogoDao.connection();
        const sql = `SELECT
                prdnam.prdno as codigo,
                prdnam.name as nome,
                (SELECT refprice FROM prp where prp.prdno = prdnam.prdno and prp.storeno = ?),
                cl.name as grupo
            FROM 
                prdnam
                JOIN prd ON prd.no = prdnam.prdno
                JOIN cl ON cl.no = prd.clno
            ORDER BY  prd.no
            LIMIT ? OFFSET ?;
            
            SELECT
            count(1) as totalLinhas
            FROM
            prdnam;
        `;
        const [produtos] = await conexao.query(sql, [loja, limit, offset]);
        return produtos;
    }
    async totalLinhas() {
        const conexao = await CatalogoDao.connection();
        const sql = `SELECT
            count(1) as totalLinhas
            FROM
            prdnam
        `;
        const [totalLinhas] = await conexao.query(sql);
        return totalLinhas;
    }
}

module.exports = CatalogoDao;
