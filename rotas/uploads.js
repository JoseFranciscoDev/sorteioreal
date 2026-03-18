const express = require("express");
const router = express.Router();
const  upload = require("../middlewares/uploadImagem.js");
const CatalogoController = require("../controle/CatalogoController.js");
const CatalogoService = require("../services/CatalogoService.js"); 
const ProdutoImagemDao = require("../modelo/ProdutoImagemDao.js");
const conexao = require("../databases/conexao.js");

const produtoImagemDao = new ProdutoImagemDao(conexao);

const catalogoService = new CatalogoService(produtoImagemDao);

const catalogoController = new CatalogoController(catalogoService);

router.post("/catalogo/upload", upload.array("imagens", 10), catalogoController.uploadImagens.bind(CatalogoController));


module.exports = router;


