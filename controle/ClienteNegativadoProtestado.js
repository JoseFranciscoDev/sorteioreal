const {lerArquvioUniversal, removerArquivo} = require("../utilitarios/LerArquivo.js");
const Data = require("../utilitarios/Data.js")
const ProcessorFactory = require("../modelo/ProcessorFactory.js");

class ClienteNegativadoProtestado {



    
    async uploads(req, res) {
        const [arquivoUrl] = req.files;
        const {tipoArquvio} = req.body;
        const caminhoArquivo = arquivoUrl.path;
      try {
       
        const processor = ProcessorFactory.Processor(tipoArquvio);

        if (!processor) {
          return res.status(400).json({error: "Tipo de arquivo invalido"});

        }


        const dados = await  lerArquvioUniversal(caminhoArquivo);

        const ClientesFormatados = processor.map(dados);
        await processor.salvar(ClientesFormatados);


        return res.json({mensagem: "Processado com sucesso!", total: ClientesFormatados.length});


      } catch(error) {
          console.error("Erro no processamento: ", error);
          return res.status(500).json({erro: error.message });
      } finally {
         try {
            await removerArquivo(caminhoArquivo);
         } catch(error2) {
            console.error("Falha ao tentar remover o arquivo", error2.message);
         }
      }

       
            
        
    }
}


module.exports = ClienteNegativadoProtestado;


