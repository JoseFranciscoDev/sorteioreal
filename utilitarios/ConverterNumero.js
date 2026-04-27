
class ConverterNumero {

    static textoParaValorDouble(texto) {
        return parseFloat(texto);
    }

   static textoParaValorInteiro(texto) {
        return parseInt(texto);
    }
}


module.exports = ConverterNumero;