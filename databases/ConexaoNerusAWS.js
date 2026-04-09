const mysql = require("mysql2/promise");
const { NERUS_AWS } = require("../configs.json");

const config = {
    host: NERUS_AWS.host,
    user: NERUS_AWS.user,
    database: NERUS_AWS.database,
    port: NERUS_AWS.port,
    password: NERUS_AWS.password,
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    ssl: { rejectUnauthorized: false }
};

let pool = mysql.createPool(config);

async function conexao() {
    try {
        await pool.query("SELECT 1");
        return pool;
    } catch (erro) {
        pool = mysql.createPool(config);
        return pool;
    }
}

module.exports = conexao;
