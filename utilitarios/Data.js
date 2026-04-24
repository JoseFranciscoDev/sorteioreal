

class Data {

    static textoParaData(texto) {
                
      if (texto == null || texto == undefined || texto == "") {
            return null;
        }

        if (texto instanceof Date) {
            return texto;
        }

        const dataLimpa = texto.trim();

        if (dataLimpa.includes("/") && /^\d{2}\/\d{2}\/\d{4}$/.test(dataLimpa)) {
            const [dia, mes, ano] = dataLimpa.split("/");

            return new Date(ano, mes - 1, dia);
        }

        if (texto.includes("-") && /^\d{4}-\d{2}-\d{2}$/.test(dataLimpa)) {
            return new Date(dataLimpa.replace(/-/g, "\/"));
        }

        const data = new Date(dataLimpa);
        return isNaN(data.getTime()) ? null : data;
    }


    static dataParaTexto(data) {

        if (!(data instanceof Date) || isNaN(data.getTime())) {
            return "Data Invalida";
        }

        const dia = data.getDate().toString().padStart(2, "0");
        const mes = (data.getMonth() + 1).toString().padStart(2, "0");
        const ano = data.getFullYear();
        console.log(dia);
        return `${dia}/${mes}/${ano}`;
    }

  static dataParaBancoDeDados(data) {

        if (!(data instanceof Date) || isNaN(data.getTime())) {
            return null;
        }

        const ano = data.getFullYear();
        const mes = (data.getMonth() + 1).toString().padStart(2, "0");
        const dia = data.getDate().toString().padStart(2, "0");

        return `${ano}-${mes}-${dia}`;
  }
}


module.exports = Data;