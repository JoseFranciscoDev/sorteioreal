const PedidoDao = require("../modelo/PedidoDao.js");
const CupomDao = require("../modelo/CupomDao.js");
const CuponsClientesDao = require("../modelo/CuponsClientesDao.js");
const DocumentoCupom = require("../utilitarios/DocumentoCupom.js");
const { BASE_URL } = require("../configs.json");
const verificarCnpj = require("../utilitarios/VerificarCnpj.js");
class Cupom {
    static async adiciona(req, res) {
        try {
            req.body.usuario = req.session.usuario.codigo;
            const [pedido] = await PedidoDao.getPedido({ codigo: req.body.pedido });
            req.body.data = pedido.data;
            const [cliente] = await PedidoDao.getCliente({ codigo: req.body.cliente });

            if (cliente.e_funcionario) {
                return res.redirect(`${BASE_URL}/home/pedido?mensagem=Funcionarios não podem participar!`)
            }
            const eCnpj = verificarCnpj(cliente.cpf);
            if (eCnpj) {
                return res.redirect(`${BASE_URL}/home/pedido?mensagem=Apenas pedidos feitos por CPF podem participar!`)
            }
            const date = new Date()
            const horario = date.toLocaleTimeString('pt-BR')
            req.body.cidade = cliente.cidade;
            req.body.estado = cliente.estado;
            req.body.cep = cliente.cep;
            req.body.horario = horario;


            const cupom = {
                codigo: req.body.pedido,
                data: req.body.data,
                horario: req.body.horario,
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
                {
                    codigoCupom,
                    cliente: cupom.cliente,
                    pedido: cupom.codigo,
                    valor: cupom.valor,
                    data: cupom.data
                }, cupom.quantidade);

            const cupons = await CuponsClientesDao.getCupom({ codigoCupom });

            await Cupom.imprimirCupons(cupons);
            res.redirect(`${BASE_URL}/home/pedido`);

        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.redirect(`${BASE_URL}/home/pedido?mensagem=Pedido Duplicado. Por favor tente reimprimir!`);
            }
            throw err;
        }
    }
    static async adicionaCuponsClientes(cupom, quantidade) {

        for (let i = 0; i < quantidade; i++) {

            await CuponsClientesDao.setCupom(cupom);
        }
    }

    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static async imprimirCupons(cupons) {

        for (const cupom of cupons) {
            await DocumentoCupom.imprimir(cupom);
            await Cupom.delay(800);
        }

    }

    static async deletar(req, res) {
        const {codigo, pedido} = req.params;
        await CupomDao.delete(codigo, pedido);
        res.redirect(`${BASE_URL}/administracao/pedidos`);
    }

}

module.exports = Cupom;


