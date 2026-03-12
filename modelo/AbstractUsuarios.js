const conexao = require("../databases/conexao.js");

class AbstractUsuarios {
    constructor() {
        
        throw new Error("Essa classe não pode ser instaciada!");
        
    }
 static async getUsuarios() {
     throw new Error("Esse metodo deve ser implementado!");
 }
 static async getUsuarioCodigo(usuario) {
     throw new Error("Esse metodo deve ser implementado!");
 }
 static async setUsuario(usuario) {
     throw new Error("Esse metodo deve ser implementado!");
 } 
 static async deleteUsuario(usuario) {
     throw new Error("Esse metodo deve ser implementado!");
 } 
 static async atualizarUsuario(usuario) {
     throw new Error("Esse metodo deve ser implementado!");
 } 
    
 static  async connection() {
     return await conexao();
 }
    
}


module.exports = AbstractUsuarios




