const express = require("express");
const router = express.Router();
const Administracao = require("../controle/Administracao.js");
const Home = require("../controle/Home.js");

router.get("/administracao", Administracao.index);
router.get("/administracao/usuarios", Administracao.listarUsuarios);
router.get("/administracao/usuarios/criar", Home.criarUsuario);
router.post("/administracao/usuarios/criar", Home.criarUsuarioPost);

module.exports = router;
