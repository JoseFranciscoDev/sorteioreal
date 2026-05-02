
class ConverterNumero {

    static textoParaValorDouble(texto) {

        if (!texto) return 0;

        let valor = texto.toString().replace("R$", "").trim();

        valor = valor.split(",").join("");

        const resultado = parseFloat(valor);

        return isNaN(resultado) ? null : resultado;

    }


    static textoParaValorInteiro(texto) {

        if (!texto) return 0;

        const valor = parseInt(texto);

        return isNaN(valor) ? null : valor;
    }
}


module.exports = ConverterNumero;
