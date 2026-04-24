const fs = require("node:fs");
const path = require("node:path");
const xlsx = require("xlsx");
const readline = require("node:readline");


async function lerArquvioUniversal(caminhoArquivo) {
    try {
         const extensao = path.extname(caminhoArquivo).toLocaleLowerCase();

    if (extensao == ".xlsx" || extensao == ".xls" || extensao == ".csv") {
        const workbook = xlsx.readFile(caminhoArquivo, { encoding: "latin1", dateNF: "dd/mm/yyyy"});
        const primeiraAba = workbook.SheetNames[0];
        const dados = xlsx.utils.sheet_to_json(workbook.Sheets[primeiraAba], {defval: "", raw: false});

      //  dados.forEach(linha => console.log(linha));

      const dadosTratos = dados.map(linha => {
            const novoObejto = {};

            for (let chaveOriginal in linha) {
                const chaveLimpa = chaveOriginal
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "_")
                .replace(/_+/g, "_")
                .replace(/^_|_$/g, "");

                novoObejto[chaveLimpa] = linha[chaveOriginal];
            }

            return novoObejto;
      });


        return dadosTratos;
    }

    if (extensao == ".txt") {
        const linhas = [];
        let cabecalho = null;

        const rl = readline.createInterface({
            input: fs.createReadStream(caminhoArquivo, {encoding: "latin1"}),
            terminal: false
        });

        for await (const linha of rl) {
           // console.log(linha);

           if (!cabecalho) {
                cabecalho = linha.split(";").map(item => 
                    item.trim()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .replace(/[/.]/g, "")
                    .replace(/\s+/g, "_"));
                continue;
           }

           const valores = linha.split(";").map(item => item.trim());
           const clienteNegativados =  {};

           cabecalho.forEach((propriedade, indice) => {
                clienteNegativados[propriedade] = valores[indice] || "";
           });

            linhas.push(clienteNegativados);
        }

        return linhas;
    }

    throw new Error("Formato de arquivo " + extensao + "não suportado pelo sistema");

    } catch(error) {
        throw new Error("Falha ao ler arquivo: " +  error.message);
    }
   

  

}



async function removerArquivo(arquivoUrl) {

    try {
        await fs.promises.unlink(arquivourl);
        console.log("O arquvio em " + arquivoUrl + "foi removido com sucesso");
    } catch(error) {

        if(error.code === "ENOENT") {
            throw new Error("Erro: o arquivo não encontrado.")
        } else {
            console.error(error.message);
            throw new Error("Erro ao remover o arquivo: " + arquivoUrl);
        }

    }

}




module.exports = {lerArquvioUniversal, removerArquivo};