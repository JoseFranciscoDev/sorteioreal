const lerArquvioUniversal = require("../utilitarios/LerArquivo.js");

class ClienteNegativadoProtestado {


    
    uploads(req, res) {
        
        
        const [arquivoUrl] = req.files;
        lerArquvioUniversal(arquivoUrl.path);

            
        
    }
}


module.exports = ClienteNegativadoProtestado;


