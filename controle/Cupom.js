const PedidoDao = require("../modelo/PedidoDao.js");
const CupomDao = require("../modelo/CupomDao.js");
const CuponsClientesDao = require("../modelo/CuponsClientesDao.js");
const DocumentoCupom = require("../utilitarios/DocumentoCupom.js");
const {BASE_URL} = require("../configs.json");
class Cupom {
    

    static async adiciona(req, res) {
        req.body.usuario = req.session.usuario.codigo;
        const [pedido] = await PedidoDao.getPedido({codigo: req.body.pedido});
        req.body.data = pedido.data;
        const [cliente] = await PedidoDao.getCliente({codigo: req.body.cliente});
        req.body.cidade = cliente.cidade;
        req.body.estado = cliente.estado;
        req.body.cep = cliente.cep;

        const cupom = {
            codigo: req.body.pedido,
            data: req.body.data,
            valor: req.body.valor,
            metodoPagamento: req.body.metodoPagamento,
            quantidade: req.body.quantidade,
            cliente: req.body.cliente,
            nome: req.body.nome,
            cpf: req.body.cpf,
            telefone_fisco: req.body.telefone_fisco,
            telefone_celular: req.body.telefone_celular,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            cep: req.body.cep,
            estado: req.body.estado,
            usuario: req.body.usuario
        };


        const codigoCupom = await CupomDao.setCupom(cupom);

        await Cupom.adicionaCuponsClientes(
                {codigoCupom,
                    cliente: cupom.cliente,
                    pedido: cupom.codigo,
                    valor: cupom.valor,
                    data: cupom.data
                }, cupom.quantidade);

        const cupons = await CuponsClientesDao.getCupom({codigoCupom});

        await Cupom.imprimirCupons(cupons);
        res.redirect(`${BASE_URL}/home/pedido`);
    }
    static async adicionaCuponsClientes(cupom, quantidade) {

        for (let i = 0; i < quantidade; i++) {

            await CuponsClientesDao.setCupom(cupom);
        }
    }

    static async imprimirCupons(cupons) {
       await cupons.forEach(async function (cupom) {
           await DocumentoCupom.imprimir(cupom);
        });

    }

}

module.exports = Cupom;


