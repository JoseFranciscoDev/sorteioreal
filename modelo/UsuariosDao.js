const AbstractUsuarios = require("./AbstractUsuarios.js");


class Usuarios extends AbstractUsuarios {

    static async getUsuarios(nome = "") {

        const conn = await this.connection();
        if (!nome) {
            const texto = `select * from usuarios`;

            const [usuarios] = await conn.query(texto);

            return usuarios;

        } else {
             const texto = `select * from usuarios where usuarios.snome = ?`;

            const [usuarios] = await conn.query(texto, [nome]);

            return usuarios;
                     
            
        }


    }

    static async getUsuarioCodigo(usuario) {
        const conn = await this.connection();
        const texto = `select * from usuarios where usuarios.codigo = ?`;

        const [usuarios] = await conn.query(texto, [usuario.codigo]);

        return usuarios;

    }

    static async setUsuario(usuario) {
        const conn = await this.connection();
        const texto = `insert into usuarios(nome,snome, email, senha, tipo)
            values(?, ?, ?, ?, ?)`;


        const [usuarios] = await conn.query(texto, [usuario.nome, usuario.snome, usuario.email,
            usuario.senha, usuario.tipo]);

        return usuarios;

    }
    static async deleteUsuario(usuario) {
        const conn = await this.connection();
        const texto = `delete  from usuarios where usuarios.codigo = ?`;

        const [usuarios] = await conn.query(texto, [usuario.codigo]);

        return usuarios;

    }

    static async atualizarUsuario(usuario) {
        const conn = await this.connection();
        const texto = `update usuarios set usuarios.nome = ?, usuarios.snome = ?
                        usuarios.email = ?, usuarios.senha = ? where usuarios.codigo = ?`;

        const [usuarios] = await conn.query(texto, [usuario.codigo]);

        return usuarios;

    }
    
    static async criarTabela() {
        const conn = await this.connection();
        const texto = ` create table if not exists usuarios(
                                    codigo int not null primary key auto_increment,
                                    nome varchar(255) not null,
                                    snome varchar(255) not null,
                                    email varchar(255) not null unique,
                                    senha varchar(255) not null,
                                    tipo tinyint not null default 0)`;
        await conn.query(texto);
    }

}



module.exports = Usuarios;

