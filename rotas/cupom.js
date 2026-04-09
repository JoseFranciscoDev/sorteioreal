const express = require("express");
const router = express.Router();
const cupom = require("../controle/Cupom.js");
router.post("/pedido/cupom", cupom.adiciona);
router.get("/pedido/delete/:codigo", cupom.deletar);
module.exports = router;


