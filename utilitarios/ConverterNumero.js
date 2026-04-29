
class ConverterNumero {

    static textoParaValorDouble(texto) {

        if (!texto) return 0;

        const valor = texto.toString().replace(/[^\d,]/g, "")
                        .replace(/\./g, "")
                        .replace(",", ".");

        return parseFloat(valor) || 0;
    }


   static textoParaValorInteiro(texto) {
        return parseInt(texto);
    }
}


module.exports = ConverterNumero;