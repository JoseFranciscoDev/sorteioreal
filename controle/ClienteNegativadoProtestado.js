const {lerArquvioUniversal, removerArquivo} = require("../utilitarios/LerArquivo.js");
const Data = require("../utilitarios/Data.js")
const ProcessorFactory = require("../modelo/ProcessorFactory.js");
const NavBar = require("../utilitarios/NavBar.js");
const { BASE_URL } = require("../configs.json");
const SerasaDao = require("../modeloDao/SerasaDao.js");
const SpcDao = require("../modeloDao/SpcDao.js");
const ProtestoDao = require("../modeloDao/ProtestoDao.js");
const conexao = require("../databases/conexao.js");

class ClienteNegativadoProtestado {
    
    async uploads(req, res) {
        const [arquivoUrl] = req.files;
        const {tipoArquivo} = req.body;
        const caminhoArquivo = arquivoUrl.path;
        
      try {
       
        const processor = ProcessorFactory.Processor(tipoArquivo);

        if (!processor) {
          return res.status(400).json({error: "Tipo de arquivo invalido"});

        }


        const dados = await  lerArquvioUniversal(caminhoArquivo);
        
        const ClientesFormatados = processor.map(dados);
       
        await processor.salvar(ClientesFormatados);

       
        return res.redirect(`${BASE_URL}/negativados?tipo=${tipoArquivo}&mensagem=Importado com sucesso!`);


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

    async listarNegativados(req, res) {
        const modulos = NavBar.getModulos();
        const tipo = req.query.tipo || "spc";
        const mensagem = req.query.mensagem || null;

        const tiposValidos = ["spc", "serasa", "protesto"];
        if (!tiposValidos.includes(tipo)) {
            return res.redirect(`${BASE_URL}/negativados?tipo=spc`);
        }

        try {
            let clientes = [];

            if (tipo === "spc") {
                const dao = new SpcDao(conexao);
                clientes = await dao.listar();
            } else if (tipo === "serasa") {
                const dao = new SerasaDao(conexao);
                clientes = await dao.listar();
            } else if (tipo === "protesto") {
                const dao = new ProtestoDao(conexao);
                clientes = await dao.listar();
            }

            return res.render("conciliacao/negativados.njk", {
                modulos,
                BASE_URL,
                tipo,
                clientes,
                mensagem
            });

        } catch (erro) {
            console.error("[ClienteNegativadoProtestado] Erro ao listar:", erro.message);
            return res.render("conciliacao/negativados.njk", {
                modulos,
                BASE_URL,
                tipo,
                clientes: [],
                mensagem: "Erro ao buscar os dados: " + erro.message,
                erro: true
            });
        }
    }
	
	async conciliar(req, res) {
		const {tipo} = req.params;
		const processor = ProcessorFactory.Processor(tipo);
		
		const resultado = await processor.executarAuditoriaDefensiva();
		
		res.json(resultado);
		
		
	}
}


module.exports = ClienteNegativadoProtestado;


