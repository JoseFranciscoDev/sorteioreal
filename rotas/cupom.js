const express = require("express");
const router = express.Router();
const CuponsClientesDao = require("../modelo/CuponsClientesDao.js")
const cupom = require("../controle/Cupom.js");
const NavBar = require("../utilitarios/NavBar.js")
const { BASE_URL } = require("../configs.json")

router.post("/pedido/cupom", cupom.adiciona);
router.get("/pedido/:cupom/", async (req, res) => {
    const modulos = NavBar.getModulos()
    const codigoPedido = req.params.cupom;
    const cupons = await CuponsClientesDao.getCuponsPorPedido(codigoPedido)
    return res.render("cupons.njk", { BASE_URL, modulos, cupons, codigoPedido })
})
router.get("/pedido/delete/:codigo", cupom.deletar);

module.exports = router;
