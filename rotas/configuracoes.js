const express = require("express");
const router = express.Router();
const Configuracoes = require("../controle/Configuracoes.js");

router.get("/home/configuracoes", Configuracoes.index);
router.post("/home/configuracoes", Configuracoes.salvar);

module.exports = router;
