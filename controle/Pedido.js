const {BASE_URL} = require("../configs.json");
const PedidoDao = require("../modelo/PedidoDao.js");
const CuponsClientesDao = require("../modelo/CuponsClientesDao.js");
const Cupom = require("./Cupom.js");




class Pedido {

    static urlsAtualizarReimpressao() {
        const links = [
            {
                url: `${BASE_URL}/home`,
                clase: "bx bxs-home icon",
                nome: "Pagina Inicial"
            },
            {
                url: `${BASE_URL}/home/pedido`,
                clase: "bx bx-plus-circle icon",
                nome: "Modulo de Sorteio"
            }

        ];

      

        return links;

    }

    static reimpressao(req, res) {
        const links = Pedido.urlsAtualizarReimpressao();
        res.render("reimpressao.html", {url: `${BASE_URL}/home/pedido/reimpressao`, links});
    }
    static async reimpressaoCupom(req, res) {
        try {
            console.log(req.body);
            if (!req.body) {
                throw new Error("Os campos pedido e ultimo cupom, são obrigatorios!");
            }
            if (!req.body.pedido || !req.body.ultimoCupom) {
                throw new Error("Os campos pedido e ultimo cupom, são obrigatorios!");
            }

            const cupons = await CuponsClientesDao.getCupomPedido(req.body);

            await Cupom.imprimirCupons(cupons);

            res.redirect(`${BASE_URL}/home/pedido`);
        } catch (erro) {
            const links = Pedido.url();
            res.render("pedido.njk", {url: `${BASE_URL}/home/pedido`, mensagem: erro.message, links});

        }

    }

    static atualizar(req, res) {
        const links = Pedido.urlsAtualizarReimpressao();
        res.render("pedidoSemCliente.html", {url: `${BASE_URL}/home/atualizar/pedido`, links});
    }
    static async atualizarPedido(req, res) {

        try {

            if (!req.body) {
                throw new Error("Campos pedido e cliente, são obrigatorios!");
            }
            if (!req.body.pedido || !req.body.cliente) {
                throw new Error("Campos pedido e cliente, são obrigatorios!");
            }

            const [pedido] = await PedidoDao.getPedido({codigo: req.body.pedido});

            if (!pedido) {
                throw new Error("Pedido cancelado ou expierado!");
            }

            if (pedido.cliente) {
                throw new Error("Esse pedido já tem Cliente!");
            }

            if ((pedido.valor / 100) < 1) {
                throw new Error("Pedido com o valor insuficiente!");
            }

            const [cliente] = await PedidoDao.getCliente({codigo: req.body.cliente});

            const cupom = {
                pedido: pedido.codigo,
                valor: pedido.valor,
                metodoPagamento: pedido.metodoPagamento,
                cliente: cliente.codigo,
                nome: cliente.nome,
                cpf: cliente.cpf,
                telefone_fisco: "(" + Pedido.formatarNumero(cliente.ddd) + ")" + " " + Pedido.formatarNumero(cliente.telefone_fisco),
                telefone_celular: "(" + Pedido.formatarNumero(cliente.ddd) + ")" + " " + Pedido.formatarNumero(cliente.telefone_celular),
                endereco: cliente.bairro,
                quantidade: parseInt(pedido.valor / 100)
            };

            res.render("form.njk", {cupom, url: `${BASE_URL}/pedido/cupom`});

        } catch (erro) {

            const links = Pedido.url();
            res.render("pedido.njk", {url: `${BASE_URL}/home/pedido`, mensagem: erro.message, links});
        }


    }

    static url() {

        return [
            {
                url: `${BASE_URL}/home`,
                clase: "bx bxs-home icon",
                nome: "Pagina Inicial"
            },
            {
                url: `${BASE_URL}/home/atualizar/pedido`,
                clase: "bx bx-plus-circle icon",
                nome: "Pedido sem Cliente"
            },

            {
                url: `${BASE_URL}/home/pedido/reimpressao`,
                clase: "bx bxs-coupon icon",
                nome: "Reimpressão"
            },
            {
                url: `${BASE_URL}/home/ultimoCupomGerado`,
                clase: "bx bx-info-circle icon",
                nome: "Último cupom Gerado"
            }



        ];


    }
    static  index(req, res) {

        const links = Pedido.url();
        res.render("pedido.njk", {url: `${BASE_URL}/home/pedido`, mensagem: "", links});
    }

    static async buscaPedido(req, res) {
        try {
            if (!req.body.pedido || !req.body) {

                throw new Error("Esse campo é obrigatorio!");
            }
            const [pedido] = await PedidoDao.getPedido({codigo: req.body.pedido});

            if (!pedido) {

                throw new Error("Pedido cancelado ou expirado!");
            }

            if (pedido.valor / 100 < 1) {

                throw new Error("Pedido com o valor insuficiente!");

            }



            if (!pedido.cliente) {

                throw new Error("Pedido sem cliente, por favor vincular o cliente ao pedido.");
            }

            const [cliente] = await PedidoDao.getCliente({codigo: pedido.cliente});
            if (!cliente) {
                throw new Error("É preciso cadastrar o cliente para participar da promoção");
            }

            const cupom = {
                pedido: pedido.codigo,
                valor: parseFloat(pedido.valor).toFixed(2),
                metodoPagamento: pedido.metodoPagamento,
                cliente: cliente.codigo,
                nome: cliente.nome,
                cpf: cliente.cpf,
                telefone_fisco: "(" + Pedido.formatarNumero(cliente.ddd) + ")" + " " + Pedido.formatarNumero(cliente.telefone_fisco),
                telefone_celular: "(" + Pedido.formatarNumero(cliente.ddd) + ")" + " " + Pedido.formatarNumero(cliente.telefone_celular),
                endereco: cliente.bairro,
                quantidade: parseInt(pedido.valor / 100)
            };

            res.render("form.njk", {cupom, url: `${BASE_URL}/pedido/cupom`});

        } catch (erro) {
            const links = Pedido.url();
            console.log(erro);
            res.render("pedido.njk", {url: `${BASE_URL}/home/pedido`, mensagem: erro.message, links});
        }


    }
    static formatarNumero(numero) {

        return parseInt(numero) <= 0 ? "" : numero;
    }

}

module.exports = Pedido;


