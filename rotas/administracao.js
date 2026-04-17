const express = require("express");
const router = express.Router();
const Administracao = require("../controle/Administracao.js");
const Home = require("../controle/Home.js");
const vericaEAdmin = require("../middlewares/vericaEAdmin.js")


router.get("/", Administracao.index);
router.get("/usuarios", vericaEAdmin, Administracao.listarUsuarios);
router.get("/pedidos", Administracao.listarPedidos);
router.get("/usuarios/criar", Home.criarUsuario);
router.post("/usuarios/criar", Home.criarUsuarioPost);

module.exports = router;
