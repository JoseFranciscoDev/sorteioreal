const express = require("express");
const router = express.Router();
const Pedido = require("../controle/Pedido.js");
router.get("/home/pedido",Pedido.index);
router.post("/home/pedido",Pedido.buscaPedido);
router.get("/home/atualizar/pedido",Pedido.atualizar);
router.post("/home/atualizar/pedido",Pedido.atualizarPedido);
router.get("/home/pedido/reimpressao",Pedido.reimpressao);
router.post("/home/pedido/reimpressao",Pedido.reimpressaoCupom);
module.exports = router;


