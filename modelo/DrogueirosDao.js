const AbstractNerusAWS = require("./AbstractNerusAWS.js");

const PRODUTOS_POR_PAGINA = 50;

class DrogueirosDao extends AbstractNerusAWS {

    static async getProdutos(limit, offset, busca = null) {
        const conn = await this.connection();
        let sql;
        if (!busca) {
            sql = `
            SELECT
                prd.no   AS "Código",
                prdnam.name   AS "Descrição",
                prd.barcode   AS "Código de Barras",
                prd.clno   AS "N. Cent. de Lucro",
                cl.name   AS "Nome Cent. Lucro",
                vend.name   AS "Fornecedor",
                (
                    SELECT DATE_FORMAT(date, "%d/%m/%Y")
                    FROM iprd
                    WHERE iprd.prdno = prd.no
                    ORDER BY date DESC
                    LIMIT 1
                    )   AS "Ultima Compra"
            FROM prd
            JOIN prdnam ON prdnam.prdno = prd.no
            JOIN cl     ON cl.no = prd.clno
            JOIN iprd   ON iprd.prdno = prd.no
            JOIN inv    ON inv.invno = iprd.invno
            JOIN vend   ON vend.no = inv.vendno
            GROUP BY prd.no
            LIMIT ? OFFSET ?
                `;
            const [produtos] = await conn.query(sql, [limit, offset]);
            return produtos;
        } if (busca) {
            const eNumero = !Number.isNaN(Number(busca))
            if (eNumero) {
                busca = Number.parseInt(busca)
                sql = `
                SELECT
                    prd.no   AS "Código",
                    prdnam.name   AS "Descrição",
                    prd.barcode   AS "Código de Barras",
                    prd.clno   AS "N. Cent. de Lucro",
                    cl.name   AS "Nome Cent. Lucro",
                    vend.name   AS "Fornecedor",
                    (
                        SELECT DATE_FORMAT(date, "%d/%m/%Y")
                        FROM iprd
                        WHERE iprd.prdno = prd.no
                        ORDER BY date DESC
                        LIMIT 1
                        )   AS "Ultima Compra"
                FROM prd
                JOIN prdnam  ON prdnam.prdno = prd.no
                JOIN cl      ON cl.no = prd.clno
                LEFT JOIN iprd ON iprd.prdno = prd.no
                LEFT JOIN inv  ON inv.invno = iprd.invno
                LEFT JOIN vend ON vend.no = inv.vendno
                WHERE prd.no = ?
                GROUP BY prd.no
                LIMIT ? OFFSET ?`
                const [produtos] = await conn.query(sql, [busca, limit, offset]);
                return produtos;
            }
            else {
                sql = `
                SELECT
                prd.no   AS "Código",
                prdnam.name   AS "Descrição",
                prd.barcode   AS "Código de Barras",
                prd.clno   AS "N. Cent. de Lucro",
                cl.name   AS "Nome Cent. Lucro",
                vend.name   AS "Fornecedor",
                (
                    SELECT DATE_FORMAT(date, "%d/%m/%Y")
                    FROM iprd
                    WHERE iprd.prdno = prd.no
                    ORDER BY date DESC
                    LIMIT 1
                    )   AS "Ultima Compra"
                    FROM prd
                    JOIN prdnam ON prdnam.prdno = prd.no
                    JOIN cl     ON cl.no = prd.clno
                    JOIN iprd   ON iprd.prdno = prd.no
                    JOIN inv    ON inv.invno = iprd.invno
                    JOIN vend   ON vend.no = inv.vendno
                    WHERE prdnam.name LIKE ?
                    GROUP BY prd.no
                    LIMIT ? OFFSET ?`
                const [produtos] = await conn.query(sql, [`%${busca}%`, limit, offset]);
                return produtos;
            }
        }
    }
}

module.exports = { DrogueirosDao, PRODUTOS_POR_PAGINA };
