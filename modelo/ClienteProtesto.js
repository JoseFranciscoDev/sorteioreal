const ConverterNumero = require("../utilitarios/ConverterNumero.js");
const Data = require("../utilitarios/Data.js");

class ClienteProtesto {
    constructor(pedido, comarcaCartorio, dataSolicitacao, comarcaDevedor, devedor, docDevedor, titulo, valorTitulo, valorProtestado,
        protocolo, dataProtocolo, especie, statusPedido, irregularidade, ocorrenciaTitulo, dataOcorrencia) {
           this._pedido = ConverterNumero.textoParaValorInteiro(pedido);
           this._comarcaCartorio = comarcaCartorio;
           this._dataSolicitacao = Data.textoParaData(dataSolicitacao);
           this._comarcaDevedor = comarcaDevedor;
           this._devedor = devedor;
           this._docDevedor = docDevedor;
           this._titulo = titulo;
           this._valorTitulo = ConverterNumero.textoParaValorDouble(valorTitulo);
           this._valorProtestado = ConverterNumero.textoParaValorDouble(valorProtestado);
           this._protocolo = ConverterNumero.textoParaValorInteiro(protocolo);
           this._dataProtocolo = Data.textoParaData(dataProtocolo);
           this._especie = especie;
           this._statusPedido = statusPedido;
           this._irregularidade = irregularidade;
           this._ocorrenciaTitulo = ocorrenciaTitulo;
           this._dataOcorrencia = Data.textoParaData(dataOcorrencia); 

    }


    get pedido() {
        return this._pedido;
    }
    get comarcaCartorio() {
        return this._comarcaCartorio;
    }
    get dataSolicitacao() {
        return this._dataSolicitacao;
    }

    get comarcaDevedor() {
        return this._comarcaDevedor;
    }

    get devedor() {
        return this._devedor;
    }

    get docDevedor() {
        return this._docDevedor;
    }

    get titulo() {
        return this._titulo;
    }

    get valorTitulo() {
        return this._valorTitulo;
    }

    get valorProtestado() {
        return this._valorProtestado;
    }

    get protocolo() {
        return this._protocolo;
    }

    get dataProtocolo() {
        return this._dataProtocolo;
    }

    get especie() {
        return this._especie;
    }

    get statusPedido() {
        return this._statusPedido;
    }

    get irregularidade() {
        return this._irregularidade;
    }

    get ocorrenciaTitulo() {
        return this._ocorrenciaTitulo;
    }

    get dataOcorrencia() {
        return this._dataOcorrencia;
    }

}


module.exports = ClienteProtesto;