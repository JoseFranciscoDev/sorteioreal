const NerusAWS = require("../databases/ConexaoNerusAWS.js");
class AbstractNerusAWS {
    
    static async getPedido(pedido) {
        
        throw new Error("É preciso implementar esse metodo!");
    }
    
    static async getCliente(pedido) {
        
        throw new Error("É preciso implementar esse metodo!");
    }
    
  static  async connection () {
        
        return await NerusAWS();
        
        
    }
}


module.exports = AbstractNerusAWS;


