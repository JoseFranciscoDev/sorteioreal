

class Data {

    static textoParaData(texto) {
                
      if (texto == null || texto == undefined || texto == "") {
            return null;
        }

        if (texto instanceof Date) {
            return texto;
        }

        const dataLimpa = texto.trim();

        if (dataLimpa.includes("/") && /^\d{2}\/\d{2}\/\d{2,4}$/.test(dataLimpa)) {
            let [dia, mes, ano] = dataLimpa.split("/");

            if (ano.length === 2) {
                ano = "20" + ano;
            }

        

            const dataObjeto = new Date(ano, mes - 1, dia);

            return isNaN(dataObjeto.getTime()) ? null : dataObjeto;
        }

        if (texto.includes("-") && /^\d{4}-\d{2}-\d{2}$/.test(dataLimpa)) {
            return new Date(dataLimpa.replace(/-/g, "\/"));
        }

        if (dataLimpa.includes("/") && dataLimpa.includes(":") && 
            /^\d{2}\/\d{2}\/\d{2,4} \d{2}:\d{2}(:\d{2})?$/.test(dataLimpa)) {
                const [parteData, parteHora] = dataLimpa.split(" ");
                let [dia, mes, ano] = parteData.split("/");
                let [hora, min, seg] = parteHora.split(":");

                if (ano.length ===2) ano = "20" + ano;

                const dataObjeto = new Date(ano, mes - 1, dia, hora, min, seg || 0);

                
                return isNaN(dataObjeto.getTime()) ? null : dataObjeto;
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
		
		const horas = data.getHours().toString().padStart(2, "0");
		const minutos = data.getMinutes().toString().padStart("2", "0");
		const seg = data.getSeconds().toString().padStart(2,"0");
		
		if (horas != 0 || minutos != 0 || seg != 0) {
			
			return `${dia}/${mes}/${ano} ${horas}:${minutos}:${seg}`;
		}
		       
        return `${dia}/${mes}/${ano}`;
    }
	

  static dataParaBancoDeDados(data) {

        if (!(data instanceof Date) || isNaN(data.getTime())) {
            return null;
        }

        const ano = data.getFullYear();
        const mes = (data.getMonth() + 1).toString().padStart(2, "0");
        const dia = data.getDate().toString().padStart(2, "0");
		
		
		const temhora = data.getHours() != 0 || data.getMinutes() != 0 || data.getSeconds() != 0;
		
		if (temhora) {
			const hora = data.getHours().toString().padStart(2, "0");
			const min = data.getMinutes().toString().padStart(2,"0");
			const seg = data.getSeconds().toString().padStart(2,"0");
			
			return `${ano}-${mes}-${dia} ${hora}:${min}:${seg}`;
		}

        return `${ano}-${mes}-${dia}`;
  }
}


module.exports = Data;