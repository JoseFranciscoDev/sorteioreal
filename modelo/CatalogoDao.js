const AbstractNerus = require("../modelo/AbstractNerusAWS");

class CatalogoDao extends AbstractNerus {
    async buscarProdutos(limit, offset, loja) {
        const conexao = await CatalogoDao.connection();
        const sql = `SELECT
            prdnam.prdno,
            prdnam.name,
            (SELECT refprice FROM prp where prp.prdno = prdnam.prdno and prp.storeno = ?) AS refprice
        FROM
            prdnam
            LIMIT ? OFFSET ?
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
