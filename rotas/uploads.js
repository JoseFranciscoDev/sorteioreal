const express = require("express");
const router = express.Router();
const { uploadImagens, uploadArquivos } = require("../middlewares/Uploads.js");
const UploadsController = require("../controle/UploadsController.js");
const CatalogoCardsController = require("../controle/CatalogoCardsController.js");
const UploadsService = require("../services/UploadsService.js");
const UploadsDao = require("../modelo/UploadsDao.js");
const CatalogoDao = require("../modelo/CatalogoDao.js");
const conexao = require("../databases/conexao.js");
const conexaoAWS = require("../databases/ConexaoNerusAWS");

const uploadsDao = new UploadsDao(conexao, conexaoAWS);
const catalogoDao = new CatalogoDao();

const uploadsService = new UploadsService(uploadsDao, catalogoDao);

const uploadsController = new UploadsController(uploadsService);
const catalogoCardsController = new CatalogoCardsController(uploadsService);


router.get("/produtos", (req, res) => uploadsController.listarProdutos(req, res));
router.get("/catalogo", (req, res) => catalogoCardsController.listarProdutos(req, res));
router.get("/produtos/:codigo", (req, res) => uploadsController.detalhesProduto(req, res));
router.post("/uploads", uploadImagens.array("imagens", 10), (req, res) => uploadsController.uploads(req, res));
router.get("/uploads", (req, res) => uploadsController.uploadsImagens(req, res));
router.delete("/uploads/:id", (req, res) => uploadsController.removeImagens(req, res));
router.patch("/uploads/:id", uploadImagens.array("imagens", 1), (req, res) => uploadsController.uploadsImagensUpdate(req, res));


module.exports = router;


