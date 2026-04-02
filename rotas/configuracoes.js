const express = require("express");
const router = express.Router();
const Configuracoes = require("../controle/Configuracoes.js");

router.get("/configuracoes", Configuracoes.index);
router.post("/configuracoes", Configuracoes.salvar);

module.exports = router;
