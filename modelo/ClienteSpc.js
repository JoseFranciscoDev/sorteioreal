const Data = require("../utilitarios/Data.js");

class ClienteSpc {

    constructor(codigoSpc, cpfCnpj, consumidor, contrato, dataVencimento, valorDebito, dataInclusao, horaInclusao,
        dataExclusao, tipoNotificacao, codigoNotificacao, codAssociado) {


        this._codigoSpc = this._textoParaValorInteiro(codigoSpc);
        this._cpfCnpj = cpfCnpj;
        this._consumidor = consumidor;
        this._contrato = contrato;
        this._dataVencimento = Data.textoParaData(dataVencimento);
        this._valorDebito = this._textoParaValorDouble(valorDebito);
        this._dataInclusao = Data.textoParaData(dataInclusao);
        this._horaInclusao = horaInclusao;
        this._dataExclusao = Data.textoParaData(dataExclusao);
        this._tipoNotificacao = tipoNotificacao;
        this._codigoNotificacao = this._textoParaValorInteiro(codigoNotificacao);
        this._codAssociado = this._textoParaValorInteiro(codAssociado);

        }


    get codigoSpc() {
        return this._codigoSpc;
    }

    get cpfCnpj() {
        return this._cpfCnpj
    }

    get consumidor() {
        return this._consumidor;
    }

    get contrato() {
        return this._contrato
    }

    get dataVencimento() {
        return this._dataVencimento;
    }

    get valorDebito() {
        return this._valorDebito;
    }

    get dataInclusao() {
        return this._dataInclusao;
    }

    get horaInclusao() {
        return this._horaInclusao;
    }

    get dataExclusao() {
        return this._dataExclusao;
    }

    get tipoNotificacao() {
        return this._tipoNotificacao;
    }

    get codigoNotificacao() {
        return this._codigoNotificacao;
    }

    get codAssociado() {
        return this._codAssociado;
    }

    _textoParaValorDouble(texto) {
        return parseFloat(texto);
    }

    _textoParaValorInteiro(texto) {
        return parseInt(texto);
    }
        
}



module.exports = ClienteSpc;