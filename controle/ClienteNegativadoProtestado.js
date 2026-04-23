const lerArquvioUniversal = require("../utilitarios/LerArquivo.js");

class ClienteNegativadoProtestado {


    
    async uploads(req, res) {
        
        
        const [arquivoUrl] = req.files;
      const dados = await  lerArquvioUniversal(arquivoUrl.path);


      return res.json({dados});

            
        
    }
}


module.exports = ClienteNegativadoProtestado;


