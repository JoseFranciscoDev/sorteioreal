const express = require("express");
const router = express.Router();
const CuponsClientesDao = require("../modelo/CuponsClientesDao.js")
const cupom = require("../controle/Cupom.js");
const NavBar = require("../utilitarios/NavBar.js")
const { BASE_URL } = require("../configs.json")

router.post("/pedido/cupom", cupom.adiciona);
router.get("/pedido/delete/:pedido/:codigo", cupom.deletar);
router.get("/pedido/:pedido/", async (req, res) => {
    const modulos = NavBar.getModulos()
    const codigoPedido = req.params.pedido;
    const cupons = await CuponsClientesDao.getCuponsPorPedido(codigoPedido)
    return res.render("cupons.njk", { BASE_URL, modulos, cupons, codigoPedido })
});

module.exports = router;
