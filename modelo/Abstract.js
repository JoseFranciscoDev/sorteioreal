const connection = require("../databases/conexao.js");
class Abstract {
    constructor() {
        throw new Error("Essa class não pode ser instanciada");
    }
   static async setCupom(cupom) {
        throw new Error("Esse metodo precisa ser implementado!");
    }
  static async  getcupom (cupom) {
        throw new Error("Esse metodo precisa ser implementado!");
        
    }
  static async  delete (cupom) {
        throw new Error("Esse metodo precisa ser implementado!");
        
    }
  static async  atualiza (cupom) {
        throw new Error("Esse metodo precisa ser implementado!");
        
    }
    
  static async connection() {
        
        return await connection();
    }
    
}


module.exports = Abstract;


