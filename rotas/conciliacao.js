const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const Conciliacao = require("../controle/Conciliacao");

router.get("/conciliacao/cadastro/veiculos", Conciliacao.cadastroVeiculos);
router.post("/conciliacao/cadastro/veiculos", Conciliacao.cadastroVeiculosPost);
router.get("/conciliacao/cadastro/Rota", Conciliacao.cadastroRota);
router.post("/conciliacao/cadastro/Rota", Conciliacao.cadastroRotaPost);
router.get("/conciliacao/cadastro/Visita", Conciliacao.cadastroVisita);
router.post("/conciliacao/cadastro/visita", upload.any(), Conciliacao.cadastroVisitaPost);
router.get("/conciliacao/visualizar", Conciliacao.visualizar);
router.get("/conciliacao/visitas/:id/corridas", Conciliacao.visualizarCorridas);

module.exports = router;