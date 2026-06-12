const AbstractNerusAWS = require("./AbstractNerusAWS.js");

const PRODUTOS_POR_PAGINA = 50;

class DrogueirosDao extends AbstractNerusAWS {

    static async getProdutos(limit, offset, busca = null) {
        const conn = await this.connection();
        let sql;
        if (!busca) {
            sql = `
            SELECT
                prd.no                          AS "Código",
                prdnam.name                     AS "Descrição",
                IFNULL(DATE_FORMAT(MAX(iprd.date), "%d/%m/%Y"), "") AS "Ultima Compra",
                prd.barcode                     AS "Código de Barras",
                stk.qtty_varejo / 1000          AS "Saldo",
                prd.clno                        AS "N. Cent. de Lucro",
                cl.no                           AS "No Cent. Lucro",
                cl.name                         AS "Nome Cent. Lucro",
                stk.storeno                     AS "Loja",
                vend.name                       AS "Fornecedor"
            FROM prd
            LEFT JOIN prdnam  ON prdnam.prdno = prd.no
            LEFT JOIN cl      ON cl.no = prd.clno
            LEFT JOIN stk     ON stk.prdno = prd.no
            LEFT JOIN iprd    ON iprd.prdno = prd.no AND iprd.cfop NOT IN (5906, 5905, 1202)
            LEFT JOIN inv     ON inv.invno = iprd.invno
            LEFT JOIN vend    ON vend.no = inv.vendno
            GROUP BY iprd.storeno, iprd.prdno
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
                    prd.no                          AS "Código",
                    prdnam.name                     AS "Descrição",
                    IFNULL(DATE_FORMAT(MAX(iprd.date), "%d/%m/%Y"), "") AS "Ultima Compra",
                    prd.barcode                     AS "Código de Barras",
                    stk.qtty_varejo / 1000          AS "Saldo",
                    prd.clno                        AS "N. Cent. de Lucro",
                    cl.no                           AS "No Cent. Lucro",
                    cl.name                         AS "Nome Cent. Lucro",
                    stk.storeno                     AS "Loja",
                    vend.name                       AS "Fornecedor"
                FROM prd
                LEFT JOIN prdnam  ON prdnam.prdno = prd.no
                LEFT JOIN cl      ON cl.no = prd.clno
                LEFT JOIN stk     ON stk.prdno = prd.no
                LEFT JOIN iprd    ON iprd.prdno = prd.no AND iprd.cfop NOT IN (5906, 5905, 1202)
                LEFT JOIN inv     ON inv.invno = iprd.invno
                LEFT JOIN vend    ON vend.no = inv.vendno
                WHERE prd.no = ?
                GROUP BY iprd.storeno, iprd.prdno
                LIMIT ? OFFSET ?
                `;
                const [produtos] = await conn.query(sql, [busca, limit, offset]);
                return produtos;
            }
            else {
                sql = `
                SELECT
                    prd.no                          AS "Código",
                    prdnam.name                     AS "Descrição",
                    IFNULL(DATE_FORMAT(MAX(iprd.date), "%d/%m/%Y"), "") AS "Ultima Compra",
                    prd.barcode                     AS "Código de Barras",
                    stk.qtty_varejo / 1000          AS "Saldo",
                    prd.clno                        AS "N. Cent. de Lucro",
                    cl.no                           AS "No Cent. Lucro",
                    cl.name                         AS "Nome Cent. Lucro",
                    stk.storeno                     AS "Loja",
                    vend.name                       AS "Fornecedor"
                FROM prd
                LEFT JOIN prdnam  ON prdnam.prdno = prd.no
                LEFT JOIN cl      ON cl.no = prd.clno
                LEFT JOIN stk     ON stk.prdno = prd.no
                LEFT JOIN iprd    ON iprd.prdno = prd.no AND iprd.cfop NOT IN (5906, 5905, 1202)
                LEFT JOIN inv     ON inv.invno = iprd.invno
                LEFT JOIN vend    ON vend.no = inv.vendno
                WHERE prdnam.name LIKE ?
                GROUP BY iprd.storeno, iprd.prdno
                LIMIT ? OFFSET ?
                `;
                const [produtos] = await conn.query(sql, [`%${busca}%`, limit, offset]);
                return produtos;
            }
        }
    }
}

module.exports = { DrogueirosDao, PRODUTOS_POR_PAGINA };
