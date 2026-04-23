const express = require("express");
const router = express.Router();
const Conciliacao = require("../controle/Conciliacao");

router.get("/conciliacao/cadastro/veiculos", Conciliacao.cadastroVeiculos);
router.post("/conciliacao/cadastro/veiculos", Conciliacao.cadastroVeiculosPost);
router.get("/conciliacao/cadastro/Rota", Conciliacao.cadastroRota);
router.get("/conciliacao/cadastro/Visita", Conciliacao.cadastroVisita);
router.post("/conciliacao/cadastro/visita", Conciliacao.cadastroVisitaPost);
router.get("/conciliacao/visualizar", Conciliacao.visualizar);
router.get("/conciliacao/visitas/:id/corridas", Conciliacao.visualizarCorridas);

module.exports = router;