const AbstractNerus = require("../modelo/AbstractNerusAWS");

class CatalogoDao extends AbstractNerus {
    async buscarProdutos(limit, offset, loja, busca = null) {
        const conexao = await CatalogoDao.connection();
        let whereClause = "";
        let queryParams = [loja];
        let countParams = [];

        if (busca) {
            whereClause = ` WHERE prdnam.prdno LIKE ? OR prdnam.name LIKE ? `;
            const termoBusca = `%${busca}%`;
            queryParams.push(termoBusca, termoBusca);
            countParams.push(termoBusca, termoBusca);
        }

        queryParams.push(limit, offset);

        const sql = `SELECT
                prdnam.prdno as codigo,
                prdnam.name as nome,
                (SELECT refprice FROM prp where prp.prdno = prdnam.prdno and prp.storeno = ?) as refprice,
                cl.name as grupo
            FROM 
                prdnam
                JOIN prd ON prd.no = prdnam.prdno
                JOIN cl ON cl.no = prd.clno
            ${whereClause}
            ORDER BY  prd.no
            LIMIT ? OFFSET ?;
            
            SELECT
            count(1) as totalLinhas
            FROM
            prdnam
            ${whereClause};
        `;
        
        const paramsFinal = [...queryParams, ...countParams];
        const [produtos] = await conexao.query(sql, paramsFinal);
        return produtos;
    };

    async buscarProdutoPorCodigo(limit, offset, loja, codigo) {
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
            WHERE prdnam.prdno = ?
            ORDER BY  prd.no
            LIMIT ? OFFSET ?;
        `;
        const [produtos] = await conexao.query(sql, [loja, codigo, limit, offset]);
        return produtos;
    }
}

module.exports = CatalogoDao;
