class FormatarData {
    static formatarData(data) {
        const dia = data.getDate();
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }
    static formatarHora(data) {
        const hora = data.getHours();
        const minuto = data.getMinutes();
        const segundo = data.getSeconds();
        return `${hora}:${minuto}:${segundo}`;
    }
}

module.exports = FormatarData;