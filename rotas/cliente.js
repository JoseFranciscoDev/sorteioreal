const express = require("express");
const ClienteDao = require("../modelo/ClienteDao.js");
const router = express.Router();
const { BASE_URL, INCENTIVO } = require("../configs.json");
const ClienteNerusDao = require("../modelo/ClienteNerusDao.js");
const NavBar = require("../utilitarios/NavBar.js");
const PedidoDao = require("../modelo/PedidoDao.js");

router.get("/cliente", async (req, res) => {
    const erro = req.query.erro;
    const modulos = NavBar.getModulos();
    res.render("cliente.njk", { modulos, erro, url: `${BASE_URL}/cliente`, BASE_URL });
});


router.get("/cliente/todos", async (req, res) => {
    const erro = req.query.erro;
    const clientes = await ClienteDao.getClientes();
    const modulos = NavBar.getModulos();
    res.render("clientes.njk", { modulos, erro, clientes, BASE_URL });
});


router.post("/cliente", async (req, res) => {
    const novoCliente = req.body;
    novoCliente.codigoUsuario = req.session.usuario.codigo;
    novoCliente.codigoPedido = novoCliente.codigoPedido || null;
    const verificarBingo = await ClienteDao.getClienteBingo(novoCliente);
    if (verificarBingo.length > 0) {
        res.redirect(`${BASE_URL}/cliente?erro=Erro: Cliente já cadastrado no sistema!`);
        return;
    }

    const verificarNerus = await ClienteNerusDao.getCliente(novoCliente);
    if (verificarNerus.length == 0) {
        res.redirect(`${BASE_URL}/cliente?erro=Cliente ${novoCliente.codigoCliente} não cadastrado no Nérus!`);
        return;
    }

    const dataComecoIncentivo = INCENTIVO.data_comeco;

    if (verificarNerus[0].data_cadastro < dataComecoIncentivo) {
        res.redirect(`${BASE_URL}/cliente?erro=Cliente ${novoCliente.codigoCliente} cadastrado no Nérus antes do começo do incentivo!`);
        return;
    }

    if (novoCliente.codigoPedido) {
        const verificarPedido = await PedidoDao.getPedido(novoCliente);
        if (verificarPedido.length == 0) {
            res.redirect(`${BASE_URL}/cliente?erro=Pedido ${novoCliente.codigoPedido} não cadastrado no Nérus!`);
            return;
        }
    }

    try {
        const resultado = await ClienteDao.setCliente(novoCliente);
        res.redirect(`${BASE_URL}/cliente?erro=Cliente cadastrado com sucesso!`);
    } catch (erro) {
        res.redirect(`${BASE_URL}/cliente?erro=Erro ao cadastrar cliente!`);
    }
})

module.exports = router;