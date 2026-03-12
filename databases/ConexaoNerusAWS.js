const mysql = require("mysql2/promise");
const {NERUS_AWS} = require("../configs.json");
async function conexao () {
    const configuracao = {
        host:NERUS_AWS.host,
        user:NERUS_AWS.user,
        database:NERUS_AWS.database,
        port: NERUS_AWS.port,
        password: NERUS_AWS.password
    };
    const conn = await mysql.createConnection(configuracao);
    
    return conn;
    
}

module.exports = conexao;


