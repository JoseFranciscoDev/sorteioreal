const Data = require("../utilitarios/Data.js");
const ConverterNumero = require("../utilitarios/ConverterNumero.js");


class ClienteSerasa {
    constructor(status, id, nomeDevedor, tipoPessoa, documento, natureza, valor, dataCadastro, dataOcorrenciaVencimento, operacao) {
        this._status = status;
        this._id = ConverterNumero.textoParaValorInteiro(id);
        this._nomeDevendor = nomeDevedor;
        this._tipoPessoa = tipoPessoa;
        this._documento = documento;
        this._natureza= natureza;
        this._valor =ConverterNumero.textoParaValorDouble(valor);
        this._dataCadastro = Data.textoParaData(dataCadastro);
        this._dataOcorrenciaVencimento = Data.textoParaData(dataOcorrenciaVencimento);
        this._operacao = operacao;

    }


    get status() {
        return this._status;

    }

    get id() {
        return this._id;
    }


    get nomeDevedor() {
        return this._nomeDevedor;
    }

    get tipoPessoa() {
        return this._tipoPessoa;
    }

    get documento() {
        return this._documento;
    }


    get natureza() {
        return this._natureza;
    }

    get valor() {
        return this._valor;

    }

    get dataCadastro() {
        return this._dataCadastro;
    }

    get dataOcorrenciaVencimento() {
        return this._dataOcorrenciaVencimento;
    }

    get operacao() {
        return this._operacao;
    }

}

module.exports = ClienteSerasa;