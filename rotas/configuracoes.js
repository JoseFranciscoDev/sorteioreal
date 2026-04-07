const express = require("express");
const router = express.Router();
const Configuracoes = require("../controle/Configuracoes.js");

router.get("/", Configuracoes.index);
router.post("/", Configuracoes.salvar);

module.exports = router;
