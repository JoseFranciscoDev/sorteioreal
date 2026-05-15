const AbstractNerus = require("../databases/ConexaoNerusAWS")

class DrogrueirosDao extends AbstractNerus {
    static async buscarProdutos() {
        const conn = this.connection();
        const sql = `
            
        `
    }
}

/*
codigo - prd
descricao - prdnam
ultima compra - iprd
preco fabricante - prp
preco referencia - prp
saldo loja 1 - stk
saldo loja 2 - stk
No Cent Lucro - cl
Nome Cent Lucro - cl
Cod Barras - prdbar
NCM - prd
Fornecedor - vend
*/
