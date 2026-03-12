const mysql = require("mysql2/promise");
const { REAL_BINGO } = require("../configs.json");
let conn
async function conexao() {
    const configuracao = {
        host: REAL_BINGO.host,
        user: REAL_BINGO.user,
        database: REAL_BINGO.database,
        port: REAL_BINGO.port,
        password: REAL_BINGO.password
    };
    if (conn != null) {
        return conn
    }
    conn = await mysql.createConnection(configuracao);

    return conn;
}

module.exports = conexao;