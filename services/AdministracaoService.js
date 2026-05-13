const CupomDao = require("../modelo/CupomDao");
const CuponsClientesDao = require("../modelo/CuponsClientesDao")
class AdministracaoService {
    constructor(AdministracaoDao) {
        this.AdministracaoDao = AdministracaoDao;
    }

    static async getPedidos(pagina, porPagina) {

        const offset = (pagina - 1) * porPagina;

        const { pedidos, total } = await CupomDao.getPedidos(porPagina, offset);
        const ultimaPagina = Math.ceil(total / porPagina);
        const codigosPedidos = pedidos.map(pedido => pedido.pedido);
        const verificarCuponsImpressos = await CuponsClientesDao.verificarCuponsImpressos(codigosPedidos);

        // Indexa pelo codigoPedido para evitar mapeamento errado por posição
        const cuponsMap = new Map(verificarCuponsImpressos.map(r => [r.codigoPedido, r]));
        for (const pedido of pedidos) {
            const info = cuponsMap.get(pedido.pedido)
            pedido.todoCuponsImpressos = info ? Boolean(info.todosCuponImpressos) : false
            pedido.quantidadeImpressa = info ? info.quantidadeImpressa : 0
        }
        return { pedidos, ultimaPagina }
    }
}

module.exports = AdministracaoService