const path = require("path");
const { ThermalPrinter, PrinterTypes } = require("node-thermal-printer");
const { HOST_IMPRESSORA } = require("../configs.json");
class DocumentoCupom {
    static configuracao() {
        return new ThermalPrinter({
            type: PrinterTypes.EPSON,
            interface: `tcp://${HOST_IMPRESSORA.ip}`,
            removeSpecialCharacters: true,
            lineCharacter: "=",
            option: {
                timeout: HOST_IMPRESSORA.timeout
            }

        });

    }

    static async imprimir(cupom) {
        const printer = DocumentoCupom.configuracao();
        printer.alignCenter();
        await printer.printImage(
            path.join(__dirname, "..", "./public/image/for-cupom.png"));
        printer.print("\n");
        printer.setTypeFontB();
        printer.setTextSize(1, 1);
        printer.println("45 ANOS DE HISTORIA");
        printer.print("\n");
        printer.print("45 PRÊMIOS PRA VOCÊ!\n");
        printer.setTextSize(0, 0);
        printer.print("\n");
        printer.print("CUPOM PARA SORTEIO EMISSAO: " + cupom.data + "\n");
        printer.setTextSize(3, 2);
        printer.print(this.adicionarZeroAEsqueda(cupom.codigo) + "\n");
        printer.setTextSize(0, 0);
        printer.setTypeFontB();
        printer.setTypeFontA();
        printer.print("NOME: " + cupom.nome + "\n");
        printer.print("CPF: " + cupom.cpf + "\n");
        printer.print("END:" + cupom.endereco + "\n");
        printer.print("CIDADE: " + cupom.cidade + "   UF: " + cupom.estado + "\n");
        printer.print("TEL: " + cupom.telefone + "\n");
        printer.bold(true);
        printer.print("Qual a melhor loja de departamentos\n");
        printer.print(" do sul do Piauí?\n");
        printer.print("(  ) SHOPPING Real");
        printer.bold(false);
        printer.print("   (  ) Outra\n");
        printer.bold(true);
        printer.print("Concorda com os termos da promoção?\n");
        printer.print("( ) SIM");
        printer.bold(false);
        printer.print("   (  ) Não\n");
        printer.print("Regulamento disponível em:\n");
        printer.print("shoppingreal.com/45anos\n")
        printer.print("Ass.:_______________________________________\n");
        printer.setTypeFontA();
        printer.setTypeFontB();
        printer.print("(Obrigatório)\n");
        printer.setTypeFontB();
        printer.setTypeFontA();
        printer.print("Sorteio às 11h de 24/12/2026\n");
        printer.setTypeFontA();
        printer.print("*Para o recebimento de prêmios eh obrigatório \n");
        printer.print("estar adimplente com a empresa.");
        printer.cut();
        await printer.execute();
    }

    static adicionarZeroAEsqueda(codigoCupom) {
        let codigoCupomControle = JSON.stringify(codigoCupom);
        codigoCupom = codigoCupomControle;
        const controle = 7;
        for (let index = codigoCupomControle.length; index < controle; index++) {

            codigoCupom = "0" + codigoCupom;


        }

        return codigoCupom;


    }



}


module.exports = DocumentoCupom;

