const express = require("express");
const router = express.Router();
const Drogueiros = require("../controle/Drogueiros.js");

router.get("/compras/drogueiros", Drogueiros.listarProdutos);

module.exports = router;
