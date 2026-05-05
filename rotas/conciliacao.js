const express = require("express");
const router = express.Router();
const { uploadImagens } = require("../middlewares/Uploads.js");
const Conciliacao = require("../controle/Conciliacao");

router.get("/conciliacao/cadastro/veiculos", Conciliacao.cadastroVeiculos);
router.post("/conciliacao/cadastro/veiculos", Conciliacao.cadastroVeiculosPost);
router.get("/conciliacao/cadastro/Rota", Conciliacao.cadastroRota);
router.post("/conciliacao/cadastro/Rota", Conciliacao.cadastroRotaPost);
router.get("/conciliacao/cadastro/Visita", Conciliacao.cadastroVisita);
router.post("/conciliacao/cadastro/visita", uploadImagens.fields([
    { name: "foto_resid", maxCount: 1 },
    { name: "foto_doc", maxCount: 1 }
]), Conciliacao.cadastroVisitaPost);
router.get("/conciliacao/visualizar", Conciliacao.visualizar);
router.get("/conciliacao/rotas/:codigo/visitas", Conciliacao.visualizarVisitas);
router.get("/conciliacao/visitas/:codigo", Conciliacao.detalheVisita);

module.exports = router;