const express = require("express");
const router = express.Router();
const cupom = require("../controle/Cupom.js");
router.post("/pedido/cupom",cupom.adiciona);
module.exports = router;


